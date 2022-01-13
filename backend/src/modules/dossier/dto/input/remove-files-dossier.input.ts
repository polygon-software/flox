import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class RemoveDossierFilesInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => [ID])
  fileUuids: string[];
}
