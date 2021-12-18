import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Address } from '../../../address/entities/address.entity';
import { Bank } from '../../../bank/entities/bank.entity';
import { CreatePersonInput } from '../../../person/dto/create-person.input';
import { CreateAddressInput } from '../../../address/dto/input/create-address.input';
import { CreateBankInput } from '../../../bank/dto/input/create-bank.input';
import { STATUS } from '../../../../ENUM/ENUMS';

@InputType('dossier')
export class CreateDossierInput extends PartialType(CreatePersonInput) {
  @Field(() => CreateAddressInput, { nullable: true })
  @IsNotEmpty()
  correspondence_address: Address;

  @Field(() => CreateBankInput, { nullable: true })
  @IsNotEmpty()
  original_bank: Bank;

  @Field(() => Date, { nullable: true })
  @IsDate()
  born: Date;

  @Field(() => CreateAddressInput, { nullable: true })
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
