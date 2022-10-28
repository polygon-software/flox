import { Field } from '@nestjs/graphql';

import { IsNumber, IsOptional } from 'class-validator';

import { GetMultipleArgs } from '../../../abstracts/crud/dto/get-multiple.args';

export default class GetMultipleImagesArgs extends GetMultipleArgs {
  @Field(() => [Number], {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires: number;
}
