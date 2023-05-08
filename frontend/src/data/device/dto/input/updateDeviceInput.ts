import { IsOptional, IsString } from 'class-validator';

import CreateDeviceInput from 'src/data/device/dto/input/createDeviceInput';

/**
 * A class representing an input object for updating device data object
 */
export default class UpdateDeviceInput extends CreateDeviceInput {
  @IsString()
  @IsOptional()
  uuid?: string;
}
