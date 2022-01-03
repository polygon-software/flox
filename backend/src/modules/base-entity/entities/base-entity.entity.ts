import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { IsUUID } from 'class-validator';

@ObjectType()
export class BaseEntity {
  @Field(() => ID, { description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;
}
