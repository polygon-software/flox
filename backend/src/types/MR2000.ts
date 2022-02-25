import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MR2000 {
  @Field(() => String, { description: 'CLI ID' })
  cli: string;

  @Field(() => String, { description: 'Serial number' })
  serialNumber: string;

  @Field(() => String, { description: 'PID' })
  pid: string;

  @Field(() => Number, { description: 'Number of files' })
  numberOfFiles: number;

  /**
   * Constructor
   * @param {string} cli - CLI ID
   * @param {string} serialNumber - Serial Number
   * @param {string} pid - PID
   * @param {number} numberOfFiles - number of device files
   */
  constructor(
    cli: string,
    serialNumber: string,
    pid: string,
    numberOfFiles: number,
  ) {
    this.cli = cli;
    this.serialNumber = serialNumber;
    this.pid = pid;
    this.numberOfFiles = numberOfFiles;
  }
}
