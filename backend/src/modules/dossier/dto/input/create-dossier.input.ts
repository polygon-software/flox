import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import {STATUS} from "../../../../ENUM/ENUMS";
import {Address} from "../../../address/entities/address.entity";
import {Bank} from "../../../bank/entities/bank.entity";
import {Offer} from "../../../offer/entities/offer.entity";

@InputType()
export class CreateDossierInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  correspondence_address: Address;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  original_bank: Bank;

  @Field(() => Date, { nullable: true })
  @IsNotEmpty()
  born: Date;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  property_address: Address;

  @Field(() => Number, { nullable: true })
  @IsNotEmpty()
  loan_sum: number;

  @Field(() => Boolean, { nullable: true })
  @IsNotEmpty()
  non_arrangeable: boolean;
}
