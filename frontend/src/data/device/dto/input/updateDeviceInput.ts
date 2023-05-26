import { IsOptional, IsString } from 'class-validator';

import CreateDeviceInput from 'src/data/device/dto/input/createDeviceInput';
import DeviceEntity from 'src/data/device/entities/deviceEntity';
import { DEVICE_TYPE } from 'src/data/ENUM';

/**
 * A class representing an input object for updating a device data object
 */
export default class UpdateDeviceInput extends CreateDeviceInput {
  @IsString()
  @IsOptional()
  uuid?: string;

  /**
   * Constructor for UpdateDeviceInput
   * @param [deviceType] - The type of the device
   * @param [deviceManufacturer] - The manufacturer of the device
   * @param [deviceModel] - The model of the device
   * @param [deviceProductionNumber] - The production number of the device
   * @param [deviceProductionYear] - The production year of the device
   * @param [deviceInformation] - Additional information about the device
   * @param [uuid] - The uuid of the device
   */
  constructor(
    deviceType?: DEVICE_TYPE,
    deviceManufacturer?: string,
    deviceModel?: string,
    deviceProductionNumber?: string,
    deviceProductionYear?: number,
    deviceInformation?: string,
    uuid?: string
  ) {
    super();
    this.uuid = uuid;
    this.deviceType = deviceType;
    this.deviceManufacturer = deviceManufacturer;
    this.deviceModel = deviceModel;
    this.deviceProductionNumber = deviceProductionNumber;
    this.deviceProductionYear = deviceProductionYear;
    this.deviceInformation = deviceInformation;
  }

  /**
   * Transform DeviceEntity to input
   * @param {DeviceEntity} device - The device entity from the database
   * @returns {UpdateDeviceInput} - The device input for update
   */
  static fromDevice(device?: DeviceEntity): UpdateDeviceInput {
    return new UpdateDeviceInput(
      device?.deviceType,
      device?.deviceManufacturer,
      device?.deviceModel,
      device?.deviceProductionNumber,
      device?.deviceProductionYear,
      device?.deviceInformation,
      device?.uuid
    );
  }
}
