import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { LEGAL_FORM } from '../../../../ENUM/enum';
import UpdateAddressInput from '../../../address/dto/input/update-address.input';

@InputType()
export default class CreateClientInput {
  @Field(() => String, { description: "Client's first name", nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @Field(() => String, { description: "Client's last name", nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @Field(() => String, {
    description: "Name of the client's company",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  companyName: string;

  @Field(() => LEGAL_FORM, {
    description: "Legal form of the client's company",
    nullable: true,
  })
  @IsEnum(LEGAL_FORM)
  @IsOptional()
  companyLegalForm: LEGAL_FORM;

  @Field(() => UpdateAddressInput, {
    description: "Client's address",
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  address: UpdateAddressInput;

  @Field(() => String, { description: "Client's phone number", nullable: true })
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
}
