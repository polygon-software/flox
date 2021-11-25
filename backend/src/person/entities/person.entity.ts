import { ObjectType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { Column } from 'typeorm';

@ObjectType()
export class Person extends BaseEntity {
  @Column()
  @Field(() => String, { description: 'First Name' })
  @IsString()
  first_name: string;

  @Column()
  @Field(() => String, { description: 'Last Name' })
  @IsString()
  last_name: string;
}
