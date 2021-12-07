import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID
} from 'class-validator';
import { CATEGORY, CURRENCY, PRODUCT_STATUS } from '../../../../ENUM/ENUM';
import PublicFile from '../../../file/entities/public_file.entity';
import Comment from '../../../comment/entities/comment.entity';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

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

  @Field(() => PublicFile)
  pictures: PublicFile[];

  @Field(() => PRODUCT_STATUS)
  status: PRODUCT_STATUS;

  @Field(() => Boolean)
  @IsBoolean()
  sponsored: boolean;

  @Field(() => String)
  @IsString()
  @IsUrl()
  directBuyLink: string;

  @Field(() => Number)
  @IsNumber()
  directBuyLinkClicks: number;

  @Field(() => Number)
  @IsNumber()
  directBuyLinkMaxClicks: number;

  @Field(() => Number)
  @IsNumber()
  directBuyLinkCost: number;

  @Field(() => Number)
  @IsNumber()
  directBuyLinkMaxCost: number;

  @Field(() => String)
  @IsString()
  @IsUrl()
  brandLink: string;

  @Field(() => Number)
  @IsNumber()
  brandLinkClicks: number;

  @Field(() => Number)
  @IsNumber()
  brandLinkMaxClicks: number;

  @Field(() => Number)
  @IsNumber()
  brandLinkCost: number;

  @Field(() => Number)
  @IsNumber()
  brandLinkMaxCost: number;

  @Field(() => Number)
  @IsInt()
  minBet: number;

  @Field(() => Number)
  @IsInt()
  maxBet: number;

  @Field(() => [String])
  @IsArray()
  tags: string[]

  @Field(() => [Comment])
  @IsArray()
  comments: Comment[];

  @Field(() => Number)
  likes: number;
}
