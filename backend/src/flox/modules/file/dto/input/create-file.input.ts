import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import CreateAccessControlledInput from '../../../abstracts/crud-access-control/dto/inputs/create-access-controlled.input';

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
  @IsNotEmpty()
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
  size: number;

  @Field(() => Int, {
    nullable: true,
    description: 'URL expiration duration (in seconds)',
  })
  @IsOptional()
  @IsNumber()
  expires?: number;
}
