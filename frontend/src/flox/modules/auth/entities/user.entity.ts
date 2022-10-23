import { ROLE } from '../enums/role.enum';
import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';

/**
 * A class representing a user data object
 */
export class UserEntity extends BaseEntity {
  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    public role: ROLE,
    public username: string,
    public email: string
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
  }
}
