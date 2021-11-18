import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base-entity/entities/base-entity.entity';
import { IsDate, IsInt, IsString } from 'class-validator';

@ObjectType()
@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @Field(() => String, { description: 'Title' })
  @Column()
  @IsString()
  title: string;

  @Field(() => String, { description: 'Description' })
  @Column()
  @IsString()
  description: string;

  // TODO: Images

  @Field(() => Int, { description: 'Value' })
  @Column()
  @IsInt()
  value: number;

  @Field(() => Date, { description: 'Start date' })
  @Column()
  @IsDate()
  start: Date;

  @Field(() => Date, { description: 'End Date' })
  @Column()
  @IsDate()
  end: Date;

  // TODO: Remaining fields from UML
}
