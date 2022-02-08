import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class DisableUserInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String)
  @IsNotEmpty()
  repositoryName: string;
}
