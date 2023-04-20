import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import UpdateInput from '../../../abstracts/crud/dto/input/update.input';

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
}
