import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { OFFER_STATUS } from '../../../../ENUM/ENUMS';

@InputType()
export class UpdateOfferStatusInput {
  @Field(() => ID)
  @IsUUID()
  dossier_uuid: string;

  @Field(() => ID)
  @IsUUID()
  offer_uuid: string;

  @Field(() => OFFER_STATUS, { nullable: false })
  @IsNotEmpty()
  status: OFFER_STATUS;
}