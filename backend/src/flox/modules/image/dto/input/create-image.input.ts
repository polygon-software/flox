import { Field, ID, InputType } from '@nestjs/graphql';

import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

import { CreateInput } from '../../../abstracts/crud-access-control/dto/inputs/create.input';

@InputType()
export class CreateImageInput extends CreateInput {
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
