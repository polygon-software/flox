import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';

import DELIVERY_MEDIUMS from '../../../../enum/DELIVERY_MEDIUMS';
import ROLE from '../../../../enum/USER_ROLES';

import CreateUserInput from './create-user.input';

@InputType()
export default class AdminCreateUserInput extends CreateUserInput {
  @Field(() => ROLE)
  @IsEnum(ROLE)
  role: ROLE;

  @Field(() => [DELIVERY_MEDIUMS])
  @IsArray()
  deliveryMediums: DELIVERY_MEDIUMS[];

  @Field(() => String, { nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;
}
