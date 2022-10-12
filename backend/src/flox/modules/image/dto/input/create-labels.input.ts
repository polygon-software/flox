import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateLabelsInput {
  @Field(() => ID)
  @IsUUID()
  image: string;
}
