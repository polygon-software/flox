import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from '../modules/project/entities/project.entity';

@ObjectType()
export class MR3000 {
  @Field(() => String, { description: 'CLI ID' })
  cli: string;

  @Field(() => String, { description: 'Device name' })
  name: string;

  @Field(() => String, { description: 'Serial number' })
  serialNumber: string;

  @Field(() => Project, {
    description: 'Project the device belongs to (if any)',
    nullable: true,
  })
  project: Project;

  @Field(() => Boolean, {
    description: 'FTP forward status',
  })
  ftp: boolean;

  constructor(
    cli: string,
    name: string,
    serialNumber: string,
    project: Project,
    ftp: boolean,
  ) {
    this.cli = cli;
    this.name = name;
    this.serialNumber = serialNumber;
    this.project = project;
    this.ftp = ftp;
  }
}
