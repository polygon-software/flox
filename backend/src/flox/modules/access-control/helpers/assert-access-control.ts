import { AccessControlledEntity } from '../entities/access-controlled.entity';
import { User } from '../../auth/entities/user.entity';

export function hasReadAccess(
  entity: AccessControlledEntity,
  user?: User,
): boolean {
  if (entity.publicReadAccess) {
    return true;
  }
  if (!user) {
    return false;
  }
  if (entity.owner.uuid === user.uuid) {
    return true;
  }
}
