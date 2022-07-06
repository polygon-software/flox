import { ROLE } from 'src/data/ENUM';
import {BaseEntity} from 'src/data/types/BaseEntity';

/**
 * A class representing a user data object
 */
export class User extends BaseEntity{
  role: ROLE;
  username: string;

  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date|null,
    role: ROLE,
    username: string,
  ) {
    super(uuid, createdAt, updatedAt, deletedAt)
    this.role = role;
    this.uuid = uuid;
    this.username = username;
  }
}
