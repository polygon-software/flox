import { ForbiddenException } from '@nestjs/common';

import AccessControlledEntity from '../entities/access-controlled.entity';
import User from '../../auth/entities/user.entity';
import { DEFAULT_ROLES } from '../../roles/config';

export function hasReadAccess(entity: AccessControlledEntity, user?: User) {
  if (entity.publicReadAccess) {
    return true;
  }
  if (!user) {
    return false;
  }
  if (user.role === DEFAULT_ROLES.ADMIN) {
    return true;
  }
  if (entity.loggedInReadAccess || entity.owner.uuid === user.uuid) {
    return true;
  }
  return entity.readAccess.some((userGroup) => {
    return userGroup.users.some((groupUser) => groupUser.uuid === user.uuid);
  });
}

export function assertReadAccess(entity: AccessControlledEntity, user?: User) {
  const hasAccess = hasReadAccess(entity, user);
  if (!hasAccess) {
    throw new ForbiddenException();
  }
}

export function hasWriteAccess(
  entity: AccessControlledEntity,
  user?: User,
): boolean {
  if (!user) {
    return false;
  }
  if (user.role === DEFAULT_ROLES.ADMIN) {
    return true;
  }
  if (user && entity.owner.uuid === user.uuid) {
    return true;
  }
  return entity.writeAccess.some((userGroup) => {
    return userGroup.users.some((groupUser) => groupUser.uuid === user.uuid);
  });
}

export function assertWriteAccess(
  entity: AccessControlledEntity,
  user?: User,
): void {
  const hasAccess = hasWriteAccess(entity, user);
  if (!hasAccess) {
    throw new ForbiddenException();
  }
}
