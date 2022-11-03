import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';

export default class UserGroupEntity extends BaseEntity {
  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    public name: string,
    public users: UserEntity[]
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
  }
}
