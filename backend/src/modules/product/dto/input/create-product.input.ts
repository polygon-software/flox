import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Column } from 'typeorm';
import { CATEGORY, CURRENCY } from '../../../../ENUM/ENUM';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
  description: string;

  @Field(() => String)
  @IsString()
  brand: string;

  @Field(() => Int)
  @IsInt()
  value: number;

  @Field(() => CURRENCY)
  currency: CURRENCY;

  @Field(() => Date)
  @IsDate()
  start: Date;

  @Field(() => Date)
  @IsDate()
  end: Date;

  @Field(() => CATEGORY)
  category: CATEGORY;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl()
  directBuyLink: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl()
  brandLink: string;

  @Field(() => Number)
  @IsInt()
  minBet: number;

  @Field(() => Number)
  @IsInt()
  maxBet: number;
  // TODO: Other parameters
}
