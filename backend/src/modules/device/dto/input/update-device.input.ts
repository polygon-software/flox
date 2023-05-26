import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

import CreateDeviceInput from './create-device.input';

@InputType()
export default class UpdateDeviceInput extends PartialType(CreateDeviceInput) {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  uuid: string;
}
