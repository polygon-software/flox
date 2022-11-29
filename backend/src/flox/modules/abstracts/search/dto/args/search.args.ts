import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

import GetAllArgs from '../../../crud/dto/get-all.args';

@ArgsType()
export default class SearchArgs extends GetAllArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Search for text within items',
  })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  filter: string;

  @Field(() => String, { nullable: true, description: 'Sort by property' })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  sortBy: string;

  @Field(() => Boolean, { defaultValue: false, description: 'Sort descending' })
  @IsBoolean()
  descending: string;
}
