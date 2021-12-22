import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { DOSSIER_STATUS } from '../../../../ENUM/ENUMS';

@InputType()
export class UpdateDossierStatusInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => DOSSIER_STATUS, { nullable: false })
  @IsNotEmpty()
  status: DOSSIER_STATUS;
}
