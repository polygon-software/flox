import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import GetAllArgs from '../../../abstracts/crud/dto/get-all.args';

@ArgsType()
export default class GetAllFilesArgs extends GetAllArgs {
  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires?: number;

  @Field(() => String, {
    nullable: true,
    description: 'Path in which file must be located',
  })
  @IsOptional()
  @IsString()
  path?: string;
}