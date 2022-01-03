import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { CATEGORY, CURRENCY, PRODUCT_STATUS } from '../../../../ENUM/ENUM';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsOptional()
  @IsString()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  brand: string;

  @Field(() => CATEGORY, { nullable: true })
  @IsOptional()
  category: CATEGORY;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  value: number;

  @Field(() => CURRENCY, { nullable: true })
  @IsOptional()
  currency: CURRENCY;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  start: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  end: Date;

  @Field(() => PRODUCT_STATUS)
  status: PRODUCT_STATUS;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  sponsored: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl()
  directBuyLink: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  directBuyLinkMaxClicks: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  directBuyLinkMaxCost: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl()
  brandLink: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  brandLinkMaxClicks: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  brandLinkMaxCost: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  minBet: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  maxBet: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  tags: string[];

  // TODO: Clarify if we need repeating sales
}
