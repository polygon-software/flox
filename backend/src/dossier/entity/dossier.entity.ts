import { Field, ObjectType } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';
import { Address } from '../../address/entities/address.entity';
import { Column, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Offer } from '../../offer/entities/offer.entity';

@ObjectType()
export class Dossier extends Person {
  @Field(() => Address, { description: 'Address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, eager: true })
  correspondence_address: Address;

  @Field(() => BankEntity, { description: 'Previous Bank of the customer' })
  @JoinColumn()
  @OneToOne(() => BankEntity, { eager: true })
  original_bank: BankEntity;

  @Field(() => Date, { description: 'Date of birth of customer' })
  @Column()
  born: Date;

  @Field(() => Address, { description: 'Address of Property' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, eager: true })
  property_address: Address;

  @Field(() => Number, { description: 'Money loaned' })
  @Column()
  loan_sum: number;

  @Field(() => Boolean, { description: 'ToDo' })
  @Column()
  non_arrangeable: boolean;

  @Field(() => String, { description: 'Status of Dossier' })
  @Column()
  status: string;

  @Field(() => Offer, { description: 'List of Offers' })
  @JoinColumn()
  @OneToMany(() => Offer, (offer) => offer.dossier, { eager: true })
  offers: Offer;
}
