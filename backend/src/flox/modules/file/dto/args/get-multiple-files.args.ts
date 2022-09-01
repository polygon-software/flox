import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

import GetMultipleArgs from '../../../abstracts/crud/dto/args/get-multiple.args';

@ArgsType()
export default class GetMultipleFilesArgs extends GetMultipleArgs {
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
