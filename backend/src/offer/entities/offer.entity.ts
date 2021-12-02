import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Column } from 'typeorm';
import { IsString } from 'class-validator';
import { Dossier } from '../../dossier/entity/dossier.entity';
import { Bank } from '../../bank/entities/bank.entity';

@ObjectType()
export class Offer extends BaseEntity {
  @Column()
  @Field(() => String, { description: 'Status of Offer' })
  @IsString()
  status: string;

  //ToDo
  dossier: Dossier;

  //ToDo
  bank: Bank;
}
