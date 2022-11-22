import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndividualCustomerService } from './individual.service';
import { Entities } from './individual.entity';

@Module({
  imports: [TypeOrmModule.forFeature(Entities)],
  providers: [IndividualCustomerService],
  exports: [IndividualCustomerService],
})
export class IndividualModule {}
