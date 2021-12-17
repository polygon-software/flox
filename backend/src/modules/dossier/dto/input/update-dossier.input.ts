import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { STATUS } from '../../../../ENUM/ENUMS';
import { Address } from '../../../address/entities/address.entity';
import { Bank } from '../../../bank/entities/bank.entity';
import { Offer } from '../../../offer/entities/offer.entity';
import { CreateOfferInput } from '../../../offer/dto/input/create-offer.input';
import { CreateBankInput } from '../../../bank/dto/input/create-bank.input';

@InputType()
export class UpdateDossierInput {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  correspondence_address: Address;

  @Field(() => CreateBankInput, { nullable: true })
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

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  status: STATUS;

  @Field(() => [CreateOfferInput], { nullable: true })
  @IsArray()
  offers: Offer[];
}
