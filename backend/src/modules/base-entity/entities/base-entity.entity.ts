import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';

@ObjectType()
export class BaseEntity {
  @Field(() => ID, { description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Field(() => Date, { description: 'Creation date' })
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date, { description: 'Last modification date' })
  @UpdateDateColumn()
  last_modified_at: Date;

  @Field(() => Date, { description: 'Date of deletion' })
  @DeleteDateColumn()
  deleted_at: Date;
}
