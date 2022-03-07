import {Project} from 'src/data/types/Project';

/**
 * A class representing an MR3000/MR2000 device
 */
export class Device {
  cli: string;
  name: string;
  serialNumber: string;
  project: Project;
  // TODO more fields

  // eslint-disable-next-line require-jsdoc
  constructor(
    cli: string,
    name: string,
    serialNumber: string,
    project: Project
  ){
    this.cli = cli
    this.name = name
    this.serialNumber = serialNumber
    this.project = project
  }
}
