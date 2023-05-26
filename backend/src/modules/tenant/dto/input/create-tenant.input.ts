import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { FLOOR } from '../../../../ENUM/enum';
import UpdateAddressInput from '../../../address/dto/input/update-address.input';

@InputType()
export default class CreateTenantInput {
  @Field(() => String, { description: "Tenant's first name", nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @Field(() => String, { description: "Tenant's last name", nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @Field(() => UpdateAddressInput, {
    description: "Tenant's address",
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  address: UpdateAddressInput;

  @Field(() => String, { description: "Tenant's phone number", nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @Field(() => String, {
    description: "Client's e-mail address",
    nullable: true,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @Field(() => FLOOR, {
    description: "Floor type of tenant's apartment",
    nullable: true,
  })
  @IsEnum({ type: 'enum', enum: FLOOR, nullable: true })
  @IsOptional()
  floorType: FLOOR;

  @Field(() => Number, {
    description: "Floor number of tenant's apartment",
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  floorNumber: number;
}
