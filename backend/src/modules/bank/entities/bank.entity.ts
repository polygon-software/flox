import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Person } from '../../person/entities/person.entity';
import { Address } from '../../address/entities/address.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Offer } from '../../offer/entities/offer.entity';
import { Dossier } from '../../dossier/entity/dossier.entity';
import { IsDate } from 'class-validator';

@Entity()
@ObjectType()
export class Bank extends Person {
  @Field(() => String, { description: 'Name of the Bank' })
  @Column({ unique: true })
  name: string;

  @Field(() => String, { description: 'Three letter abbreviation of the Bank' })
  @Column({ unique: true })
  abbreviation: string;

  @Column({ nullable: true })
  @Field(() => String, { description: 'Phone Number', nullable: true })
  phone: string;

  @Field(() => Address, { description: 'Address' })
  @JoinColumn()
  @OneToOne(() => Address, { cascade: true, eager: true, nullable: true })
  address: Address;

  @Field(() => [Offer], { description: 'Offers made by Bank' })
  @JoinColumn()
  @OneToMany(() => Offer, (offer) => offer.bank)
  offers: Offer[];

  @Field(() => [Dossier], {
    description: 'Dossier where the mortgage originally belongs to the bank',
  })
  @OneToMany(() => Dossier, (dossier) => dossier.original_bank)
  own_mortgages: Dossier[];

  @Field(() => ID, {
    description: 'Date of account ban (if any)',
    nullable: true,
  })
  @Column()
  @IsDate()
  banned_at: Date;
}
