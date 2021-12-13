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
import PublicFile from '../../../file/entities/public_file.entity';

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

  @Field(() => CATEGORY)
  category: CATEGORY;

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

  @Field(() => PublicFile, { nullable: true })
  pictures: PublicFile[];

  @Field(() => PRODUCT_STATUS)
  status: PRODUCT_STATUS;

  @Field(() => Boolean)
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

  @Field(() => Number)
  @IsInt()
  minBet: number;

  @Field(() => Number)
  @IsInt()
  maxBet: number;

  @Field(() => [String])
  @IsOptional()
  @IsArray()
  tags: string[];

  // TODO: Clearify if we need Rrepeating sales
}
