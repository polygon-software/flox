import { AccessControlledEntity } from '../../../access-control/entities/access-controlled.entity';
import { User } from '../../../auth/entities/user.entity';

export function userHasReadAccess(entity: AccessControlledEntity, user: User) {
  return entity.readAccess.some((userGroup) => {
    return userGroup.users.some((groupUser) => groupUser.uuid === user.uuid);
  });
}

export function userHasWriteAccess(entity: AccessControlledEntity, user: User) {
  return entity.writeAccess.some((userGroup) => {
    return userGroup.users.some((groupUser) => groupUser.uuid === user.uuid);
  });
}
