import { ObjectType, Field, Int } from '@nestjs/graphql';
import {Column, Entity,} from 'typeorm';
import {BaseEntity} from "../../base-entity/entities/base-entity.entity";

@ObjectType()
@Entity({ name: 'user' })
export class User extends BaseEntity{
  @Field(() => String, { description: 'Name' })
  @Column()
  name: string;

  @Field(() => Int, { description: 'Age' })
  @Column()
  age: number;
}
