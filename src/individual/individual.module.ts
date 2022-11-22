import { Module } from '@nestjs/common';
import { IndividualCustomerService } from './individual.service';

@Module({
  providers: [IndividualCustomerService],
  exports: [IndividualCustomerService],
})
export class IndividualModule {}
