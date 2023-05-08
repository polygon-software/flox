import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { DEVICE_TYPE } from 'src/data/ENUM';

/**
 * A class representing an input object for creating device data object
 */
export default class CreateDeviceInput {
  @IsEnum(DEVICE_TYPE)
  @IsOptional()
  deviceType?: DEVICE_TYPE;

  @IsString()
  @IsOptional()
  deviceManufacturer?: string;

  @IsString()
  @IsOptional()
  deviceModel?: string;

  @IsString()
  @IsOptional()
  deviceProductionNumber?: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  deviceProductionYear?: number;

  @IsString()
  @IsOptional()
  deviceInformation?: string;
}
