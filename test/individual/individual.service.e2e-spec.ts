import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import * as WorkflowUtils from '@src/shared/workflowUtils';
import { CreateIndividualDto } from '@src/individual/individual.dto';
import { IndividualCustomerService } from '@src/individual/individual.service';
jest.mock('@src/shared/workflowUtils', () => ({
  createWorkflow: jest.fn().mockImplementation(() => 'test workflow url'),
  cancelWorkflow: jest.fn(),
}));

const mockedWorkflowUtils = jest.mocked(WorkflowUtils, true);

const TEST_CUSTOMER: CreateIndividualDto = {
  country: 'ALA',
  idNumber: '123456789',
  firstName: 'first',
  middleName: 'middle',
  lastName: 'last',
  email: 'test@test.com',
  mobilePhone: '+11234567890',
  phoneNumber: '+123456789',
};

describe('IndividualCustomerService (e2e)', () => {
  let app: INestApplication;
  let targetService: IndividualCustomerService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    targetService = moduleFixture.get<IndividualCustomerService>(IndividualCustomerService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    mockedWorkflowUtils.cancelWorkflow.mockClear();
    mockedWorkflowUtils.createWorkflow.mockClear();
  });

  it('creates customer triggers a workflow when create customer', async () => {
    const created = await targetService.createCustomer({ ...TEST_CUSTOMER });
    expect(created).toBeDefined();
    expect(created.customer).toBeDefined();
    expect(created.review).toBeDefined();
    expect(mockedWorkflowUtils.createWorkflow.mock.calls.length).toEqual(1);
    expect(mockedWorkflowUtils.createWorkflow.mock.calls[0][0]).toEqual(created.review.workflowId);
    expect(mockedWorkflowUtils.createWorkflow.mock.calls[0][1]).toEqual(TEST_CUSTOMER);
  });

  it('cancels a workflow and create a new one when updateCustomer', async () => {
    const created = await targetService.createCustomer({ ...TEST_CUSTOMER });
    const updated = await targetService.updateCustomer(created.customer.id, { ...TEST_CUSTOMER });
    expect(updated).toBeDefined();
    expect(updated.customer).toBeDefined();
    expect(updated.review).toBeDefined();
    // create workflow calls twice: 1 for create customoer, 2 for update customer
    expect(mockedWorkflowUtils.createWorkflow.mock.calls.length).toEqual(2);
    expect(mockedWorkflowUtils.createWorkflow.mock.calls[0][1]).toEqual(TEST_CUSTOMER);
    expect(mockedWorkflowUtils.createWorkflow.mock.calls[1][1]).toEqual(TEST_CUSTOMER);
    expect(mockedWorkflowUtils.cancelWorkflow.mock.calls.length).toEqual(1);
    expect(mockedWorkflowUtils.cancelWorkflow.mock.calls[0][0]).toEqual(created.review.workflowId);
  });

  afterAll(async () => {
    await app.close();
  });
});
