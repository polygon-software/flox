import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';

@ObjectType()
/**
 * Base entity that all others inherit from
 */
export class BaseEntity {
  @Field(() => ID, { description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Field(() => Date, { description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date, { description: 'Last modification date' })
  @UpdateDateColumn()
  lastModifiedAt: Date;

  @Field(() => Date, { description: 'Date of deletion', nullable: true })
  @DeleteDateColumn()
  deletedAt: Date;
}
