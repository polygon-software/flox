import { User } from 'src/data/types/User';

/**
 * A class representing a project data object
 */
export class Project {
  name: string;
  uuid: string;
  user: User;
  mr2000instances: string[]|null;
  mr3000instances: string[]|null;

  /**
   * Constructor
   * @param {string} name Project name
   * @param {string} uuid Project uuid
   * @param {User} user Project owner
   * @param {string[]} mr2000instances MR2000 devices that belong to the project
   * @param {string[]} mr3000instances MR3000 devices that belong to the project
   */
  constructor(name: string,
              uuid: string,
              user: User,
              mr2000instances?: string[],
              mr3000instances?: string[],){
    this.name = name
    this.uuid = uuid
    this.user = user
    this.mr2000instances = mr2000instances ?? null
    this.mr3000instances = mr3000instances ?? null
  }
}
