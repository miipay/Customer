import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { InsertResult, Repository } from 'typeorm';
import { CreateIndividualDto, UpdateIndividualDto } from './individual.dto';
import { IndividualCustomer, IndividualCustomerReview } from './individual.entity';
import { ReviewResult } from './interfaces';

type MutateResult = {
  customer: IndividualCustomer;
  review: IndividualCustomerReview;
};

@Injectable()
export class IndividualCustomerService {
  constructor(
    @InjectRepository(IndividualCustomer) private customerRepository: Repository<IndividualCustomer>,
    @InjectRepository(IndividualCustomerReview) private customerReviewRepository: Repository<IndividualCustomerReview>,
  ) {}

  async create(customer: CreateIndividualDto): Promise<MutateResult> {
    const result: InsertResult = await this.customerRepository.createQueryBuilder().insert().values(customer).execute();
    const customerEntity = result.generatedMaps[0] as IndividualCustomer;
    console.log('pump the create request to workflow', customer);
    // TODO: create a workflow for customer review
    const reviewResult: InsertResult = await this.customerReviewRepository
      .createQueryBuilder()
      .insert()
      .values({
        customer: customerEntity,
        workflowId: 'test',
        workflowURL: 'testURL',
      })
      .execute();
    return {
      customer: customerEntity,
      review: reviewResult.generatedMaps[0] as IndividualCustomerReview,
    };
  }

  async updateCustomer(id: number, updateRequest: UpdateIndividualDto): Promise<MutateResult> {
    const customer = await this.customerRepository.findOneByOrFail({ id });
    if (!customer.approved) {
      // TODO: we should cancel the workflow and recreate a new create customer review.
    }
    console.log('pump the update request to workflow', updateRequest);
    // TODO: create a workflow for customer review
    const reviewResult = await this.customerReviewRepository
      .createQueryBuilder()
      .insert()
      .values({
        // TODO: try to find a way to do subquery to make sure there is only one active review under this customer.
        customer,
        workflowId: 'test',
        workflowURL: 'testURL',
      })
      .execute();
    return {
      customer: customer,
      review: reviewResult.generatedMaps[0] as IndividualCustomerReview,
    };
  }

  async enableCustomer(id: number, enabled: boolean): Promise<IndividualCustomer> {
    const entity = await this.findOne(id);
    this.customerRepository.merge(entity, { enabled });
    return this.customerRepository.save(entity, { reload: true });
  }

  async updateReviewResult(id: number, result: ReviewResult): Promise<void> {
    const review = await this.customerReviewRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    this.customerReviewRepository.merge(review, { reviewResult: result, finished: true });
    this.customerReviewRepository.save(review, { reload: true });
    await this.customerRepository
      .createQueryBuilder()
      .update()
      .set({ approved: result.approved, approvedDate: result.approvedDate })
      .where({ id: review.customer.id })
      .execute();
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
