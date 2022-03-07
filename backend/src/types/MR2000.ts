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

  constructor(
    cli: string,
    name: string,
    serialNumber: string,
    pid: string,
    numberOfFiles: number,
    project: Project,
  ) {
    this.cli = cli;
    this.name = name;
    this.serialNumber = serialNumber;
    this.pid = pid;
    this.numberOfFiles = numberOfFiles;
    this.project = project;
  }
}
