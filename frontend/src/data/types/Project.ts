import { User } from 'src/data/types/User';

/**
 * A class representing a project data object
 */
export class Project {
  name: string;
  uuid: string;
  user: User;
  devices: string[] | null;

  // eslint-disable-next-line require-jsdoc
  constructor(name: string, uuid: string, user: User, devices?: string[]) {
    this.name = name;
    this.uuid = uuid;
    this.user = user;
    this.devices = devices ?? null;
  }
}
