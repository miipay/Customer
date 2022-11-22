import {
  Entity,
  CreateDateColumn,
  Column,
  Index,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { ReviewResult } from './interfaces';

@Entity()
export class IndividualCustomer {
  @PrimaryGeneratedColumn()
  id: number;

  // ISO country code
  @Column({ length: 3 })
  country: string;

  @Column({ length: 64 })
  idNumber: string;

  @Column({ length: 64 })
  firstName: string;

  @Column({ length: 64, nullable: true })
  middleName: string;

  @Column({ length: 64, nullable: true })
  lastName: string;

  @Column({ length: 320, nullable: true })
  email: string;

  // https://en.wikipedia.org/wiki/E.164
  @Column({ length: 15, nullable: true })
  mobilePhone: string;

  // https://en.wikipedia.org/wiki/E.164
  @Column({ length: 15, nullable: true })
  phoneNumber: string;

  @Column({ default: true })
  @Index()
  enabled: boolean;

  @Column({ default: false })
  approved: boolean;

  @Column({ type: 'datetime', precision: 6, nullable: true })
  approvedDate: Date;

  @OneToMany(() => IndividualCustomerReview, (review) => review.customer)
  reviews: IndividualCustomerReview[];

  @CreateDateColumn()
  @Index()
  created: Date;
}

// for customer review, we need to support one review one customer. If we
@Entity()
export class IndividualCustomerReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => IndividualCustomer, (customer) => customer.reviews, { onDelete: 'CASCADE' })
  customer: IndividualCustomer;

  @Column({ length: 256 })
  @Index({ unique: true })
  workflowId: string;

  @Column({ length: 2048 })
  workflowURL: string;

  @Column({ type: 'json', nullable: true })
  reviewResult: ReviewResult;

  @Column({ default: false })
  finished: boolean;

  @CreateDateColumn()
  @Index()
  created: Date;

  @UpdateDateColumn()
  @Index()
  updated: Date;
}

export const Entities = [IndividualCustomer, IndividualCustomerReview];
