import { Field, ObjectType } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';
import { Address } from '../../address/entities/address.entity';
import { JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Offer } from '../../offer/entities/offer.entity';

@ObjectType()
export class Bank extends Person {
  @Field(() => Address, { description: 'Address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, eager: true })
  address: Address;

  @Field(() => [Offer], { description: 'Offers made by Bank' })
  @OneToMany(() => Offer, (offer) => offer.bank)
  offers: Offer[];
}
