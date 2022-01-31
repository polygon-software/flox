import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateOfferInput {
  @Field(() => String)
  @IsUUID()
  bank_uuid: string;

  @Field(() => String)
  @IsUUID()
  dossier_uuid: string;
}
