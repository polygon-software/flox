import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import GetMultipleArgs from '../../../abstracts/crud/dto/get-multiple.args';

@ArgsType()
export default class GetMultipleFilesArgs extends GetMultipleArgs {
  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires?: number;
}
