import { ObjectType, Field } from '@nestjs/graphql';
import {PrimaryGeneratedColumn} from "typeorm";
import { IsUUID } from "class-validator";

@ObjectType()
export class BaseEntity {
  @Field(() => String, { description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;
}
