/**
 * A class representing an MR3000/MR2000 device
 */
export class Device {
  cli: string;
  serialNumber: string;
  // TODO more fields

  // eslint-disable-next-line require-jsdoc
  constructor(cli: string,
              serialNumber: string){
    this.cli = cli
    this.serialNumber = serialNumber
  }
}
