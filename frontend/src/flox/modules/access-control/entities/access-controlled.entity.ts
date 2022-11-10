import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';
import UserGroupEntity from 'src/flox/modules/access-control/entities/user-group.entity';

/**
 * Class that represents an access controlled entity
 */
export default class AccessControlledEntity extends BaseEntity {
  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    public publicReadAccess: boolean,
    public loggedInReadAccess: boolean,
    public owner: UserEntity,
    public readAccess: UserGroupEntity[],
    public writeAccess: UserGroupEntity[]
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
  }
}
