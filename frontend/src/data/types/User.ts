import { ROLE } from 'src/data/ENUM';

/**
 * A class representing a user data object
 */
export class User {
  role: ROLE;
  uuid: string;
  username: string;

  // eslint-disable-next-line require-jsdoc
  constructor(
    role: ROLE,
    uuid: string,
    username: string,
  ) {
    this.role = role;
    this.uuid = uuid;
    this.username = username;
  }
}
