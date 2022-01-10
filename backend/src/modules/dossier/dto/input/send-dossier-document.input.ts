import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsObject, IsUUID } from 'class-validator';
import { File } from '../../../../types/File';

@InputType()
export class SendDossierDocumentInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => [String])
  @IsArray()
  recipients: string[];

  @Field(() => String)
  @IsObject()
  file: File;
}
