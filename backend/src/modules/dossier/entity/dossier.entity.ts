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
import { DOSSIER_STATUS, PROPERTY_TYPE } from '../../../ENUM/ENUMS';
import { Employee } from '../../employee/entities/employee.entity';
import PrivateFile from '../../file/entities/private_file.entity';

@Entity()
@ObjectType()
export class Dossier extends Person {
  // First/last name and e-mail are part of 'Person'

  /**
   * Linked/base information
   */

  @Field(() => Boolean, { description: 'ToDo' })
  @Column()
  non_arrangeable: boolean;

  @Field(() => [Offer], { description: 'List of Offers', nullable: true })
  @JoinColumn()
  @OneToMany(() => Offer, (offer) => offer.dossier, { nullable: true })
  offers: Offer[];

  @Field(() => DOSSIER_STATUS, { description: 'Status of Dossier' })
  @Column({
    type: 'enum',
    enum: DOSSIER_STATUS,
    default: DOSSIER_STATUS.IN_PROGRESS,
  })
  status: DOSSIER_STATUS;

  @Field(() => Employee, { description: 'Employee who created the Dossier' })
  @ManyToOne(() => Employee, (employee) => employee.dossiers)
  employee: Employee;

  @Field(() => [PrivateFile], {
    nullable: true,
    description: 'Documents of the dossier',
  })
  @OneToMany(() => PrivateFile, (file) => file.dossier, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  documents: PrivateFile[];

  @Field(() => PrivateFile, {
    nullable: true,
    description: 'Final summary document, to be signed by customer',
  })
  @OneToOne(() => PrivateFile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  finalDocument: PrivateFile;
  /**
   * Basic information
   */

  @Field(() => String, { description: 'Phone number' })
  @Column()
  phone: string;

  @Field(() => Date, { description: 'Date of birth of customer' })
  @Column()
  birthdate: Date;

  @Field(() => Address, { description: 'Address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, eager: true })
  address: Address;

  /**
   * Value/purchase information
   */

  @Field(() => Bank, { description: 'Previous Bank of the customer' })
  @ManyToOne(() => Bank)
  original_bank: Bank;

  @Field(() => PROPERTY_TYPE, { description: 'Status of Dossier' })
  @Column({
    type: 'enum',
    enum: PROPERTY_TYPE,
  })
  property_type: PROPERTY_TYPE;

  @Field(() => Boolean, {
    description: 'Whether the property is inhabited by its owner',
  })
  @Column()
  owner_occupied: boolean;

  @Field(() => Date, {
    description: 'Date of initial purchase',
  })
  @Column()
  purchase_date: Date;

  @Field(() => Number, {
    description: 'Price of initial purchase',
  })
  @Column()
  purchase_price: number;

  @Field(() => Number, {
    description: 'Current market value estimate',
  })
  @Column()
  market_value_estimation: number;

  @Field(() => Number, {
    description: 'Current mortgage amount',
  })
  @Column()
  mortgage_amount: number;

  /**
   * Amortisation information
   */

  @Field(() => Boolean, {
    description: 'Whether the property has amortisation',
  })
  @Column()
  has_amortisation: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the property amortisation is direct',
  })
  @Column({ nullable: true })
  direct_amortisation: boolean;

  @Field(() => Number, {
    nullable: true,
    description: 'Amount of property amortisation',
  })
  @Column({ nullable: true })
  amortisation_amount: number;

  /**
   * Building lease information
   */

  @Field(() => Boolean, {
    description: 'Whether the property has a building lease',
  })
  @Column()
  has_building_lease: boolean;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the building lease landlord is public',
  })
  @Column({ nullable: true })
  public_landlord: boolean;

  @Field(() => Date, {
    nullable: true,
    description: 'Building lease expiration date',
  })
  @Column({ nullable: true })
  building_lease_expiration_date: Date;

  @Field(() => Number, {
    nullable: true,
    description: 'Amount of building lease interest',
  })
  @Column({ nullable: true })
  building_lease_interest: number;

  /**
   * Renovation information
   */

  @Field(() => Boolean, {
    description: 'Whether the property has been renovated',
  })
  @Column()
  has_renovation: boolean;

  @Field(() => Number, {
    nullable: true,
    description: 'Year of property renovation',
  })
  @Column({ nullable: true })
  renovation_year: number;

  @Field(() => Number, {
    nullable: true,
    description: 'Price of property renovation',
  })
  @Column({ nullable: true })
  renovation_price: number;
}
