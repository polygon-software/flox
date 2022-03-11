import {Project} from 'src/data/types/Project';

/**
 * A class representing an MR3000/MR2000 device
 */
export class Device {
  cli: string;
  name: string;
  serialNumber: string;
  project: Project;
  pid: string;
  ftp: boolean;
  ip: string;
  firmware: string;
  type: 'MR2000'|'MR3000';
  // TODO more fields

  // eslint-disable-next-line require-jsdoc
  constructor(
    cli: string,
    name: string,
    serialNumber: string,
    project: Project,
    pid: string,
    ftp: boolean,
    ip: string,
    firmware: string,
    type: 'MR2000'|'MR3000',
  ){
    this.cli = cli
    this.name = name
    this.serialNumber = serialNumber
    this.project = project
    this.pid = pid
    this.ftp = ftp
    this.ip = ip
    this.firmware = firmware
    this.type = type
  }
}