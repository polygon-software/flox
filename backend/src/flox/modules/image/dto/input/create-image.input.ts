import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateImageInput {
  @Field(() => String)
  @IsUUID()
  file: string;
}
