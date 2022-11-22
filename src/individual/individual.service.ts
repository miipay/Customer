import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateIndividualDto, UpdateIndividualDto } from './individual.dto';
import { IndividualCustomer, IndividualCustomerReview } from './individual.entity';
import { ReviewResult } from './interfaces';
import { safeMerge } from './utils/customerUtils';
import { withTransaction } from './utils/orm';
import { createIndividualCustomerReview, cancelIndividualCustomerReview } from './utils/workflows';

type MutateResult = {
  customer: IndividualCustomer;
  review: IndividualCustomerReview;
};

@Injectable()
export class IndividualCustomerService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(IndividualCustomer) private customerRepository: Repository<IndividualCustomer>,
  ) {}

  async createCustomer(customer: CreateIndividualDto): Promise<MutateResult> {
    return await withTransaction<MutateResult>(this.dataSource, async (manager: EntityManager) => {
      const dataToInsert = manager.create(IndividualCustomer, { ...customer });
      await manager.createQueryBuilder().insert().into(IndividualCustomer).values(dataToInsert).execute();
      return {
        customer: dataToInsert,
        review: await createIndividualCustomerReview(manager, dataToInsert, { ...customer }),
      };
    });
  }

  async updateCustomer(id: number, updateRequest: UpdateIndividualDto): Promise<MutateResult> {
    return await withTransaction<MutateResult>(this.dataSource, async (manager: EntityManager) => {
      const customer = await manager.findOneByOrFail<IndividualCustomer>(IndividualCustomer, { id });
      if (!customer.approved) {
        await cancelIndividualCustomerReview(manager, customer);
      }
      return {
        customer: customer,
        review: await createIndividualCustomerReview(manager, customer, { ...updateRequest }),
      };
    });
  }

  async enableCustomer(id: number, enabled: boolean): Promise<IndividualCustomer> {
    const entity = await this.findOne(id);
    this.customerRepository.merge(entity, { enabled });
    return this.customerRepository.save(entity, { reload: true });
  }

  async updateReviewResult(id: number, result: ReviewResult, originPayload: UpdateIndividualDto): Promise<void> {
    await withTransaction<void>(this.dataSource, async (manager: EntityManager): Promise<void> => {
      const review = await manager.findOne<IndividualCustomerReview>(IndividualCustomerReview, {
        where: { id },
        relations: ['customer'],
      });
      manager.merge<IndividualCustomerReview>(IndividualCustomerReview, review, {
        reviewResult: result,
        finished: true,
      });
      safeMerge(review.customer, originPayload);
      manager.save([review, review.customer]);
    });
  }

  findAll(query: PaginateQuery): Promise<Paginated<IndividualCustomer>> {
    return paginate(query, this.customerRepository, {
      sortableColumns: ['id', 'enabled', 'created'],
      defaultSortBy: [['created', 'DESC']],
      filterableColumns: {
        enabled: [FilterOperator.EQ],
        created: [FilterOperator.GT, FilterOperator.GTE, FilterOperator.LT, FilterOperator.LTE, FilterOperator.BTW],
      },
    });
  }

  async findOne(id: number): Promise<IndividualCustomer> {
    return this.customerRepository.findOneByOrFail({ id });
  }
}
