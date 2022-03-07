import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from '../modules/project/entities/project.entity';

@ObjectType()
export class MR3000 {
  /*
  @Field(() => User, { description: 'User that owns the device' })
  @ManyToOne(() => User, (user) => user.mr3000instances, { eager: true })
  user: User;
  */

  @Field(() => String, { description: 'CLI ID' })
  cli: string;

  @Field(() => String, { description: 'Serial number' })
  serialNumber: string;

  @Field(() => Project, {
    description: 'Project the device belongs to (if any)',
    nullable: true,
  })
  project: Project;

  constructor(cli: string, serialNumber: string, project: Project) {
    this.cli = cli;
    this.serialNumber = serialNumber;
    this.project = project;
  }
}
