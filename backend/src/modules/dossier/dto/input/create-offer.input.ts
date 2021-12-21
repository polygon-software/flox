import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { STATUS } from '../../../../ENUM/ENUMS';

@InputType()
export class CreateOfferInput {
  @Field(() => String)
  @IsUUID()
  bank_uuid: string;

  @Field(() => String)
  @IsUUID()
  dossier_uuid: string;

  @Field(() => STATUS) //Todo correct status or other status
  status: STATUS;
}
