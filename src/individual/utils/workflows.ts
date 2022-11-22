import { EntityManager } from 'typeorm';
import { createWorkflow, cancelWorkflow } from '@src/shared/workflowUtils';
import { IndividualCustomer, IndividualCustomerReview } from '../individual.entity';

export const createIndividualCustomerReview = async (
  manager: EntityManager,
  customer: IndividualCustomer,
  updatePayload: unknown,
): Promise<IndividualCustomerReview> => {
  const count = await manager
    .createQueryBuilder<IndividualCustomerReview>(IndividualCustomerReview, 'review')
    .innerJoin('review.customer', 'customer')
    .where('customer.id = :id', { id: customer.id })
    .getCount();
  const workflowId = `individualCustomerReview-${customer.id}(${count})`;
  const workflowURL = await createWorkflow(workflowId, updatePayload);
  const review = {
    customer,
    workflowId,
    workflowURL,
  };
  await manager.createQueryBuilder().insert().into(IndividualCustomerReview).values(review).execute();
  return review as IndividualCustomerReview;
};

export const cancelIndividualCustomerReview = async (manager: EntityManager, customer: IndividualCustomer) => {
  const pendingReviews = await manager
    .createQueryBuilder<IndividualCustomerReview>(IndividualCustomerReview, 'review')
    .innerJoin('review.customer', 'customer')
    .where('customer.id = :id AND finished = false', { id: customer.id })
    .getMany();
  for (const review of pendingReviews) {
    await cancelWorkflow(review.workflowId);
  }
  await manager
    .createQueryBuilder()
    .update(IndividualCustomerReview)
    .set({
      finished: true,
    })
    .whereInIds(pendingReviews.map((review) => review.id))
    .execute();
};
