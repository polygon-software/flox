import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Address } from '../../../address/entities/address.entity';
import { CreatePersonInput } from '../../../person/dto/create-person.input';
import { CreateAddressInput } from '../../../address/dto/input/create-address.input';
import { PROPERTY_TYPE } from '../../../../ENUM/ENUMS';

@InputType()
export class CreateDossierInput extends PartialType(CreatePersonInput) {
  /**
   * General information
   */
  @Field(() => String)
  @IsString()
  first_name: string;

  @Field(() => String)
  @IsString()
  last_name: string;

  @Field(() => CreateAddressInput)
  @IsNotEmpty()
  address: Address;

  @Field(() => String)
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @Field(() => Date)
  @IsDate()
  birthdate: Date;

  /**
   * Value/purchase information
   */
  @Field(() => String)
  @IsString()
  original_bank_name: string;

  @Field(() => String)
  @IsString()
  original_bank_abbreviation: string;

  @Field(() => PROPERTY_TYPE)
  property_type: PROPERTY_TYPE;

  @Field(() => Boolean)
  @IsBoolean()
  owner_occupied: boolean;

  @Field(() => Date)
  @IsDate()
  purchase_date: Date;

  @Field(() => Number)
  @IsNumber()
  purchase_price: number;

  @Field(() => Number)
  @IsNumber()
  market_value_estimation: number;

  @Field(() => Number)
  @IsNumber()
  mortgage_amount: number;

  /**
   * Amortisation information
   */
  @Field(() => Boolean)
  @IsBoolean()
  has_amortisation: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  direct_amortisation: boolean;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  amortisation_amount: number;

  /**
   * Building lease information
   */
  @Field(() => Boolean)
  @IsBoolean()
  has_building_lease: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  public_landlord: boolean;

  @Field(() => Date, { nullable: true })
  @IsDate()
  building_lease_expiration_date: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  building_lease_interest: number;

  /**
   * Renovation information
   */
  @Field(() => Boolean)
  @IsBoolean()
  has_renovation: boolean;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  renovation_year: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  renovation_price: number;

  // TODO: how to handle mortgage partitions? (object array --> might need object...)

  /**
   * Income/cost information
   */

  @Field(() => [Number])
  @IsArray()
  incomes: number[];

  @Field(() => Number)
  @IsNumber()
  child_allowances: number;

  @Field(() => Number)
  @IsNumber()
  bonus: number;

  @Field(() => Number)
  @IsNumber()
  assets: number;

  @Field(() => Number)
  @IsNumber()
  leasing: number;

  @Field(() => Number)
  @IsNumber()
  credit: number;

  @Field(() => Number)
  @IsNumber()
  alimony: number;

  @Field(() => Number)
  @IsNumber()
  various: number;

  @Field(() => Boolean)
  @IsBoolean()
  prosecutions: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  loss_certificates: boolean;

  /**
   * Flag for dossier being non-arrangeable
   */

  @Field(() => Boolean)
  @IsBoolean()
  non_arrangeable: boolean;

  /**
   * Calculated total numbers
   * TODO add
   */
}
