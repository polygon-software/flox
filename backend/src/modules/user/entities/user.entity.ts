import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsInt, IsString } from 'class-validator';

@ObjectType()
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Field(() => String, { description: 'Name' })
  @Column()
  @IsString()
  name: string;

  @Field(() => Int, { description: 'Age' })
  @Column()
  @IsInt()
  age: number;
}
