import { ArgsType, Field } from '@nestjs/graphql';

import { IsNumber, IsOptional } from 'class-validator';

import { GetOneArgs } from '../../../abstracts/crud/dto/get-one.args';

@ArgsType()
export class GetImageArgs extends GetOneArgs {
  @Field(() => [Number], {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires: number;
}
