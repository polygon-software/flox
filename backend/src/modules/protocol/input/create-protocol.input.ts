import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString } from 'class-validator';

/**
 * Protocol entity
 */
@InputType()
export default class CreateProtocolInput {
  @Field(() => Date, {
    description: 'Protocol date',
    nullable: true,
  })
  @IsDate()
  @IsOptional()
  date: Date;

  @Field(() => String, { description: 'Article number', nullable: true })
  @IsString()
  @IsOptional()
  articleNumber: string;

  @Field(() => String, { description: 'Label of the protocol', nullable: true })
  @IsString()
  @IsOptional()
  label: string;

  @Field(() => String, {
    description: 'Description of the protocol',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => String, {
    description: 'Unit of the protocol',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  unit: string;

  @Field(() => String, {
    description: 'Amount of units in the protocol',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  amount: string;

  @Field(() => String, {
    description: 'Price of units in the protocol',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  price: string;

  @Field(() => String, {
    description: 'Unit discount',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  discount: string;

  @Field(() => String, {
    description: 'Sum of the total cost in the protocol',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  sum: string;
}
