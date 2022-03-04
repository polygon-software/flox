import { Field, ObjectType } from '@nestjs/graphql';
import { MR2000 } from './MR2000';
import { MR3000 } from './MR3000';

@ObjectType()
export class Project {
  @Field(() => String, { description: 'Project name' })
  name: string;

  /*
  @Field(() => User, { description: 'User that owns the project' })
  @ManyToOne(() => User, (user) => user.projects, { eager: true })
  user: User;
  */

  @Field(() => [MR2000], { description: 'Associated MR2000 instances' })
  mr2000instances: MR2000[];

  @Field(() => [MR3000], { description: 'Associated MR3000 instances' })
  mr3000instances: MR3000[];

  /**
   * Constructor
   * @param {string} name - project name
   * @param {MR2000[]} mr2000instances - associated MR2000 instances
   * @param {MR3000[]} mr3000instances - associated MR3000 instances
   */
  constructor(
    name: string,
    mr2000instances: MR2000[],
    mr3000instances: MR3000[],
  ) {
    this.name = name;
    this.mr2000instances = mr2000instances;
    this.mr3000instances = mr3000instances;
  }
}
