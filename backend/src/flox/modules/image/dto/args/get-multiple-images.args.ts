import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

import GetMultipleArgs from '../../../abstracts/crud/dto/args/get-multiple.args';

@ArgsType()
export default class GetMultipleImagesArgs extends GetMultipleArgs {
  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires: number;
}
