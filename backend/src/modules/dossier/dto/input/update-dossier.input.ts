import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { PROPERTY_TYPE } from '../../../../ENUM/ENUMS';
import { CreateDossierInput } from './create-dossier.input';
import { CreateAddressInput } from '../../../address/dto/input/create-address.input';
import { Address } from '../../../address/entities/address.entity';

@InputType()
export class UpdateDossierInput extends PartialType(CreateDossierInput) {
  @Field(() => ID)
  @IsUUID()
  uuid: string;

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

  /**
   * Mortgage Partitions
   */

  @Field(() => [Number])
  @IsArray()
  partition_amounts: number[];

  @Field(() => [Date])
  @IsArray()
  partition_dates: Date[];

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
   */

  @Field(() => Number, { nullable: true })
  @IsNumber()
  affordability: number;

  @Field(() => Number)
  @IsNumber()
  eligible_income: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  total_costs: number;

  @Field(() => Number)
  @IsNumber()
  value_estimate_customer: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  value_estimate_calculated: number;

  @Field(() => Number)
  @IsNumber()
  enfeoffment_estimate_customer: number;

  @Field(() => Number, { nullable: true })
  @IsNumber()
  enfeoffment_estimate_calculated: number;
}
