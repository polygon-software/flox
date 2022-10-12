import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

import GetOneArgs from '../../../abstracts/crud/dto/args/get-one.args';

@ArgsType()
export default class GetImageArgs extends GetOneArgs {
  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires: number;
}
