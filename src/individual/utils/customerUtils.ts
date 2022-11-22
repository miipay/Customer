import { IndividualCustomer } from '../individual.entity';

const MERGABLE_PROPERTIES = [
  'country',
  'idNumber',
  'firstName',
  'middleName',
  'lastName',
  'email',
  'mobilePhone',
  'phoneNumber',
];

export const safeMerge = (customer: IndividualCustomer, payload: unknown) => {
  for (const prop of MERGABLE_PROPERTIES) {
    if (payload[prop]) {
      customer[prop] = payload[prop];
    }
  }
};
