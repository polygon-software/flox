import { ArgsType, Field } from '@nestjs/graphql';

import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class SearchArgs {
  @Field(() => Number, {
    defaultValue: 0,
    description: 'Number of items to skip',
  })
  @IsNumber()
  skip: number;

  @Field(() => Number, {
    defaultValue: 10,
    description: 'Number of images to take',
  })
  @IsNumber()
  take: number;

  @Field(() => String, {
    nullable: true,
    description: 'Search for text withinn items',
  })
  @IsString()
  @IsOptional()
  filter: string;

  @Field(() => String, { nullable: true, description: 'Sort by property' })
  @IsString()
  @IsOptional()
  sortBy: string;

  @Field(() => Boolean, { defaultValue: false, description: 'Sort descending' })
  @IsBoolean()
  descending: string;
}
