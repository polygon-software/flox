import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import { DEVICE_TYPE } from 'src/data/ENUM';
import FormEntity from 'src/data/form/entities/form.entity';

/**
 * A class representing a device data object
 */
export default class DeviceEntity extends BaseEntity {
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

  @IsObject()
  @IsOptional()
  form?: FormEntity;
}
