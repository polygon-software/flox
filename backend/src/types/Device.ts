import { Field, ObjectType } from '@nestjs/graphql';
import { deviceType } from 'src/helpers/device-helpers';
import { Project } from '../modules/project/entities/project.entity';

@ObjectType()
export class Device {
  @Field(() => String, { description: 'CLI ID' })
  cli: string;

  @Field(() => String, { description: 'Device name' })
  name: string;

  @Field(() => String, { description: 'Serial number' })
  serialNumber: string;

  @Field(() => String, { description: 'PID', nullable: true })
  pid: string;

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

  @Field(() => String, { description: 'Device type (MR2000 or MR3000)' })
  deviceType: string;

  constructor(
    cli: string,
    name: string,
    serialNumber: string,
    pid: string,
    project: Project,
    ftp: boolean,
    ip: string,
    firmware: string,
  ) {
    this.cli = cli;
    this.name = name;
    this.serialNumber = serialNumber;
    this.pid = pid;
    this.project = project;
    this.ftp = ftp;
    this.ip = ip;
    this.firmware = firmware;
    this.deviceType = deviceType(cli);
  }
}
