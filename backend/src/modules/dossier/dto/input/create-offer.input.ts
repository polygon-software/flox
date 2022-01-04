import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { OFFER_STATUS } from '../../../../ENUM/ENUMS';

@InputType()
export class CreateOfferInput {
  @Field(() => String)
  @IsUUID()
  bank_uuid: string;

  @Field(() => String)
  @IsUUID()
  dossier_uuid: string;

  @Field(() => OFFER_STATUS) //todo remove
  status: OFFER_STATUS;
}