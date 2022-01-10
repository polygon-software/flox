import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { DOSSIER_STATUS } from '../../../../ENUM/ENUMS';
import PrivateFile from '../../../file/entities/private_file.entity';

@InputType()
export class SendDossierDocumentInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => [String])
  @IsArray()
  recipients: string[];

  // TODO add once implemented from @johannschwabe's PR
  // @Field(() => PrivateFile)
  // @IsNotEmpty()
  // pdf: PrivateFile;
}
