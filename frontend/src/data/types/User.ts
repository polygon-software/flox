import { ROLE } from 'src/data/ENUM';
import {BaseEntity} from 'src/data/types/BaseEntity';

/**
 * A class representing a user data object
 */
export class User extends BaseEntity{
  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date|null,
    public role: ROLE,
    public username: string,
  ) {
    super(uuid, createdAt, updatedAt, deletedAt)
  }
}
