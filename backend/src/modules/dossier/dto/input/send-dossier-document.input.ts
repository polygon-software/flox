import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsUUID } from 'class-validator';
import PrivateFile from '../../../file/entities/private_file.entity';

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
  pdfUuid: string;
}
