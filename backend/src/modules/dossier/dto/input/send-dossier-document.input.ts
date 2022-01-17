import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsUUID } from 'class-validator';

@InputType()
export class SendDossierDocumentInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => [String])
  @IsArray()
  recipients: string[];

  @Field(() => ID)
  @IsUUID()
  fileUuid;
}
