import { MR2000 } from './MR2000';
import { MR3000 } from './MR3000';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Project {
  name: string;
  mr2000instances: MR2000[];
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
