import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

import UpdateAddressInput from '../../../address/dto/input/update-address.input';

@InputType()
export default class CreateBillingInput {
  @Field(() => String, { description: 'Billing company name', nullable: true })
  @IsString()
  @IsOptional()
  companyName: string;

  @Field(() => String, { description: 'First name on bill', nullable: true })
  @IsString()
  @IsOptional()
  firstName: string;

  @Field(() => String, { description: 'Last name on bill', nullable: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @Field(() => UpdateAddressInput, {
    description: 'Billing address',
    nullable: true,
  })
  @IsObject()
  @IsOptional()
  address: UpdateAddressInput;

  @Field(() => String, {
    description: 'Billing e-mail address',
    nullable: true,
  })
  @IsEmail()
  @IsOptional()
  email: string;
}
