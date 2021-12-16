import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { Address } from '../../../address/entities/address.entity';
import { Bank } from '../../../bank/entities/bank.entity';

@InputType('dossier')
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
  @IsDate()
  born: Date;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  property_address: Address;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  loan_sum: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  non_arrangeable: boolean;
}
