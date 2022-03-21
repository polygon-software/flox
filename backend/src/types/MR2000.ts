import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from '../modules/project/entities/project.entity';

@ObjectType()
export class MR2000 {
  @Field(() => String, { description: 'CLI ID' })
  cli: string;

  @Field(() => String, { description: 'Device name' })
  name: string;

  @Field(() => String, { description: 'Serial number' })
  serialNumber: string;

  @Field(() => String, { description: 'PID' })
  pid: string;

  @Field(() => Number, { description: 'Number of files' })
  numberOfFiles: number;

  @Field(() => Project, {
    description: 'Project the device belongs to (if any)',
    nullable: true,
  })
  project: Project;

  @Field(() => Boolean, {
    description: 'FTP forward status',
  })
  ftp: boolean;

  @Field(() => String, { description: 'IP address, if any', nullable: true })
  ip: string;

  @Field(() => String, { description: 'Firmware version' })
  firmware: string;

  constructor(
    cli: string,
    name: string,
    serialNumber: string,
    pid: string,
    numberOfFiles: number,
    project: Project,
    ftp: boolean,
    ip: string,
    firmware: string,
  ) {
    this.cli = cli;
    this.name = name;
    this.serialNumber = serialNumber;
    this.pid = pid;
    this.numberOfFiles = numberOfFiles;
    this.project = project;
    this.ftp = ftp;
    this.ip = ip;
    this.firmware = firmware;
  }
}
