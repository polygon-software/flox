import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Address } from '../../../address/entities/address.entity';
import { CreatePersonInput } from '../../../person/dto/create-person.input';
import { CreateAddressInput } from '../../../address/dto/input/create-address.input';
import { STATUS } from '../../../../ENUM/ENUMS';

@InputType('dossier')
export class CreateDossierInput extends PartialType(CreatePersonInput) {
  @Field(() => CreateAddressInput)
  @IsNotEmpty()
  correspondence_address: Address;

  @Field(() => String)
  @IsString()
  original_bank_name: string;

  @Field(() => String)
  @IsString()
  original_bank_abbreviation: string;

  @Field(() => Date, { nullable: true })
  @IsDate()
  born: Date;

  @Field(() => CreateAddressInput)
  @IsNotEmpty()
  property_address: Address;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  loan_sum: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  non_arrangeable: boolean;

  @Field(() => STATUS, { description: 'Status of Dossier' })
  status: STATUS;
}
