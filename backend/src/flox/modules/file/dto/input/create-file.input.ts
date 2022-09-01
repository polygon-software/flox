import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import CreateAccessControlledInput from '../../../abstracts/crud-access-control/dto/input/create-access-controlled.input';

@InputType()
export default class CreateFileInput extends CreateAccessControlledInput {
  @Field(() => String, {
    description: 'Name of File',
  })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @Field(() => String, {
    description: 'Path to file',
  })
  @IsString()
  path: string;

  @Field(() => String, {
    description: 'File mimetype',
  })
  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @Field(() => Int, {
    description: 'Size of file in bytes',
  })
  @IsInt()
  @IsNotEmpty()
  @Min(8) // Doubt files smaller than 8 bytes
  size: number;
}
