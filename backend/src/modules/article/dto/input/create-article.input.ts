import { InputType, Field } from '@nestjs/graphql';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export default class CreateArticleInput {
  @Field(() => String, { description: 'Article number', nullable: true })
  @IsString()
  @IsOptional()
  articleNumber: string;

  @Field(() => String, { description: 'Manufacturer number', nullable: true })
  @IsString()
  @IsOptional()
  manufacturerNumber: string;

  @Field(() => Number, { description: 'Amount', nullable: true })
  @IsInt()
  @IsOptional()
  amount: number;

  @Field(() => Number, {
    description: 'Discount in percent',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  discount: number;
}
