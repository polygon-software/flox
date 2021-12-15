import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { CATEGORY, CURRENCY, PRODUCT_STATUS } from '../../../../ENUM/ENUM';
import PublicFile from '../../../file/entities/public_file.entity';
import { Comment } from '../../../comment/entities/comment.entity';

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String, { nullable: true })
  @IsString()
  title: string;

  @Field(() => String, { nullable: true })
  @IsString()
  description: string;

  @Field(() => String, { nullable: true })
  @IsString()
  brand: string;

  @Field(() => CATEGORY, { nullable: true })
  category: CATEGORY;

  @Field(() => Int, { nullable: true })
  @IsInt()
  value: number;

  @Field(() => CURRENCY, { nullable: true })
  currency: CURRENCY;

  @Field(() => Date, { nullable: true })
  @IsDate()
  start: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  end: Date;

  @Field(() => PublicFile, { nullable: true })
  pictures: PublicFile[];

  @Field(() => PRODUCT_STATUS, { nullable: true })
  status: PRODUCT_STATUS;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  sponsored: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsUrl()
  directBuyLink: string;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  directBuyLinkClicks: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  directBuyLinkMaxClicks: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  directBuyLinkCost: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  directBuyLinkMaxCost: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsUrl()
  brandLink: string;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  brandLinkClicks: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  brandLinkMaxClicks: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  brandLinkCost: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  brandLinkMaxCost: number;

  @Field(() => Number, { nullable: true })
  @IsInt()
  minBet: number;

  @Field(() => Number, { nullable: true })
  @IsInt()
  maxBet: number;

  @Field(() => [String], { nullable: true })
  @IsArray()
  tags: string[];

  @Field(() => [Comment], { nullable: true })
  @IsArray()
  comments: Comment[];

  @Field(() => Number, { nullable: true })
  likes: number;
}
