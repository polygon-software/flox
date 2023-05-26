import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { DEVICE_TYPE } from '../../../../ENUM/enum';

@InputType()
export default class CreateDeviceInput {
  @Field(() => DEVICE_TYPE, { description: 'Device to repair', nullable: true })
  @IsEnum(DEVICE_TYPE)
  @IsOptional()
  deviceType: DEVICE_TYPE;

  @Field(() => String, {
    description: 'Manufacturer that made the device',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  deviceManufacturer: string;

  @Field(() => String, { description: "Device's model", nullable: true })
  @IsString()
  @IsOptional()
  deviceModel: string;

  @Field(() => String, {
    description: "Device's production number",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  deviceProductionNumber: string;

  @Field(() => Number, {
    description: 'Year the device was manufactured',
    nullable: true,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  deviceProductionYear: number;

  @Field(() => String, {
    description: 'Additional information about the device',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  deviceInformation: string;
}
