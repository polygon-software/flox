import { Field, ObjectType } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';
import { Address } from '../../address/entities/address.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Offer } from '../../offer/entities/offer.entity';
import { Bank } from '../../bank/entities/bank.entity';
import { DOSSIER_STATUS } from '../../../ENUM/ENUMS';
import { Employee } from '../../employee/entities/employee.entity';
import PrivateFile from '../../file/entities/private_file.entity';

@Entity()
@ObjectType()
export class Dossier extends Person {
  @Field(() => Address, { description: 'Address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, eager: true })
  correspondence_address: Address;

  @Field(() => Bank, { description: 'Previous Bank of the customer' })
  @ManyToOne(() => Bank)
  original_bank: Bank;

  @Field(() => Date, { description: 'Date of birth of customer' })
  @Column()
  born: Date;

  @Field(() => Address, { description: 'Address of Property' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, eager: true })
  property_address: Address;

  @Field(() => Number, { description: 'Money loaned' })
  @Column({ type: 'real' })
  loan_sum: number;

  @Field(() => Boolean, { description: 'ToDo' })
  @Column()
  non_arrangeable: boolean;

  @Field(() => DOSSIER_STATUS, { description: 'Status of Dossier' })
  @Column({
    type: 'enum',
    enum: DOSSIER_STATUS,
    default: DOSSIER_STATUS.IN_PROGRESS,
  })
  status: DOSSIER_STATUS;

  @Field(() => [Offer], { description: 'List of Offers', nullable: true })
  @JoinColumn()
  @OneToMany(() => Offer, (offer) => offer.dossier, { nullable: true })
  offers: Offer[];

  @Field(() => Employee, { description: 'Employee who created the Dossier' })
  @ManyToOne(() => Employee, (employee) => employee.dossiers)
  employee: Employee;

  @Field(() => [PrivateFile], {
    nullable: true,
    description: 'Documents of the company',
  })
  @OneToMany(() => PrivateFile, (file) => file.dossier, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  documents: PrivateFile[];
}
