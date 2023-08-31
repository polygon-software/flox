import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

import CreateAccessControlledInput from '../../../abstracts/crud-access-control/dto/input/create-access-controlled.input';

@InputType()
export default class CreateImageInput extends CreateAccessControlledInput {
  @Field(() => ID)
  @IsUUID()
  file: string;

  @Field(() => Boolean, {
    defaultValue: false,
  })
  @IsOptional()
  @IsBoolean()
  objectRecognition = false;
}
