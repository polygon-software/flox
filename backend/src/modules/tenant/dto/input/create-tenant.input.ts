import { Field, InputType } from '@nestjs/graphql';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @Field(() => String, {
    description: "Client's e-mail address",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  email: string;

  @Field(() => String, {
    description: "Floor of tenant's apartment",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  floor: string;
}
