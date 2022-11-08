import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import UpdateInput from '../../../abstracts/crud/inputs/update.input';

@InputType()
export default class UpdateFileInput extends UpdateInput {
  @Field(() => String, {
    nullable: true,
    description: 'Name of File',
  })
  @IsOptional()
  @IsString()
  public filename: string;

  @Field(() => String, {
    description: 'Path to file',
  })
  @IsString()
  @IsNotEmpty()
  path: string;

  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires?: number;
}
