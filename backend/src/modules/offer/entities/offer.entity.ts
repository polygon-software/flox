import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Entity, ManyToOne, OneToOne } from 'typeorm';
import { Dossier } from '../../dossier/entity/dossier.entity';
import { Bank } from '../../bank/entities/bank.entity';
import PrivateFile from '../../file/entities/private_file.entity';

@Entity()
@ObjectType()
export class Offer extends BaseEntity {
  @Field(() => Dossier, { description: 'Dossier of Offer' })
  @ManyToOne(() => Dossier, (dossier) => dossier.offers)
  dossier: Dossier;

  @Field(() => Bank, { description: 'Bank making the offer' })
  @ManyToOne(() => Bank)
  bank: Bank;

  @Field(() => PrivateFile, { description: 'The Offer as a PDF' })
  @OneToOne(() => PrivateFile, { nullable: true })
  pdf: PrivateFile;
}
