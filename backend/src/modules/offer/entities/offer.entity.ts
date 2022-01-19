import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Dossier } from '../../dossier/entity/dossier.entity';
import { Bank } from '../../bank/entities/bank.entity';
import PrivateFile from '../../file/entities/private_file.entity';
import { OFFER_STATUS } from '../../../ENUM/ENUMS';

@Entity()
@ObjectType()
export class Offer extends BaseEntity {
  @Field(() => Dossier, { description: 'Dossier of Offer' })
  @ManyToOne(() => Dossier, (dossier) => dossier.offers, {
    onDelete: 'SET NULL',
  })
  dossier: Dossier;

  @Field(() => Bank, { description: 'Bank making the offer' })
  @ManyToOne(() => Bank)
  bank: Bank;

  @Field(() => [PrivateFile], {
    description: 'The Offer as a PDF',
    nullable: true,
  })
  @JoinColumn()
  @OneToMany(() => PrivateFile, (file) => file.offer, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  documents: PrivateFile[];

  @Field(() => OFFER_STATUS, { description: 'Status of Dossier' })
  @Column({
    type: 'enum',
    enum: OFFER_STATUS,
    default: OFFER_STATUS.INTERESTED,
  })
  status: OFFER_STATUS;
}