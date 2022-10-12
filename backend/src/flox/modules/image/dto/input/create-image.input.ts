import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateImageInput {
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
