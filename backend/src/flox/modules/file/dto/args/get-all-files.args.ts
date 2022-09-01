import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import GetAllArgs from '../../../abstracts/crud/dto/args/get-all.args';

@ArgsType()
export default class GetAllFilesArgs extends GetAllArgs {
  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(60 * 60 * 24)
  expires?: number;

  @Field(() => String, {
    nullable: true,
    description: 'Path in which files must be located',
  })
  @IsOptional()
  @IsString()
  path?: string;
}
