import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateImageInput {
  @Field(() => ID)
  @IsUUID()
  file: string;
}
