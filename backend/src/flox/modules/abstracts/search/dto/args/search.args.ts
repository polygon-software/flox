import { ArgsType, Field } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import GetAllArgs from '../../../crud/dto/args/get-all.args';
import FilterInput from '../input/filter.input';

@ArgsType()
export default class SearchArgs extends GetAllArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Search for text within items',
  })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  searchTerm?: string;

  @Field(() => String, { nullable: true, description: 'Sort by property' })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  sortBy?: string;

  @Field(() => Boolean, { defaultValue: false, description: 'Sort descending' })
  @IsBoolean()
  descending?: string;

  @Field(() => [String], {
    nullable: true,
    description: "Subset of the module's allowed search keys to search in",
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  searchKeys?: string[];

  @Field(() => FilterInput, {
    nullable: true,
    description: 'Filter by property and value',
  })
  @IsObject()
  @IsOptional()
  filter?: FilterInput;
}
