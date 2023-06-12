import { DEVICE_TYPE } from 'src/data/ENUM';

/**
 * Device class containing the device details
 */
export default class Device {
  deviceType?: DEVICE_TYPE;

  deviceManufacturer?: string;

  deviceModel?: string;

  deviceProductionNumber?: string;

  deviceProductionYear?: number;

  deviceInformation?: string;

  // eslint-disable-next-line require-jsdoc
  constructor(
    deviceType?: DEVICE_TYPE,
    manufacturer?: string,
    model?: string,
    serialNumber?: string,
    constructionYear?: number,
    information?: string
  ) {
    this.deviceType = deviceType;
    this.deviceManufacturer = manufacturer;
    this.deviceModel = model;
    this.deviceProductionNumber = serialNumber;
    this.deviceProductionYear = constructionYear;
    this.deviceInformation = information;
  }

  /**
   * Determines whether it's a valid storable output
   * @returns - whether it's valid
   */
  isComplete(): boolean {
    return (
      !!this.deviceType &&
      !!this.deviceManufacturer &&
      !!this.deviceModel &&
      !!this.deviceProductionNumber &&
      !!this.deviceProductionYear &&
      !!this.deviceInformation
    );
  }
}
