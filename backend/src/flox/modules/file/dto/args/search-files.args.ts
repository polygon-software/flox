import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

import SearchArgs from '../../../abstracts/search/dto/args/search.args';

@ArgsType()
export default class SearchFilesArgs extends SearchArgs {
  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(60 * 60 * 24)
  expires?: number;
}
