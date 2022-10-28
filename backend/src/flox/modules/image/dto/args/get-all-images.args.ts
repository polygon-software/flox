import { ArgsType, Field, Int } from '@nestjs/graphql';

import { IsNumber, IsOptional } from 'class-validator';

import { GetAllArgs } from '../../../abstracts/crud/dto/get-all.args';

@ArgsType()
export class GetAllImagesArgs extends GetAllArgs {
  @Field(() => Int, {
    defaultValue: 500,
    description: 'Number of images to load',
  })
  take = 500;

  @Field(() => Int, {
    defaultValue: 0,
    description: 'How many images to skip',
  })
  skip = 0;

  @Field(() => [Number], {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires: number;
}
