import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export default class CreateLabelsInput {
  @Field(() => ID)
  @IsUUID()
  image: string;
}
