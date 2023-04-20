import { ForbiddenException } from '@nestjs/common';

import AccessControlledEntity from '../entities/access-controlled.entity';
import User from '../../auth/entities/user.entity';
import { DefaultRoles } from '../../roles/config';

/**
 * Determines whether the provided user had read access to the provided entity
 *
 * @param entity - access controlled entity
 * @param user - user
 * @returns whether the user had read access to the entity
 */
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
  if (user.role === DefaultRoles.ADMIN) {
    return true;
  }
  if (entity.loggedInReadAccess || entity.owner.uuid === user.uuid) {
    return true;
  }
  return entity.readAccess.some((userGroup) => {
    return userGroup.users.some((groupUser) => groupUser.uuid === user.uuid);
  });
}

/**
 * Determines whether the provided user had read access to the provided entity.
 * If the access rights are insufficient, throws error
 *
 * @param entity - access controlled entity
 * @param user - user
 */
export function assertReadAccess(
  entity: AccessControlledEntity,
  user?: User,
): void {
  const hasAccess = hasReadAccess(entity, user);
  if (!hasAccess) {
    throw new ForbiddenException();
  }
}

/**
 * Determines whether the provided user had write access to the provided entity
 *
 * @param entity - access controlled entity
 * @param user - user
 * @returns whether the user had write access to the entity
 */
export function hasWriteAccess(
  entity: AccessControlledEntity,
  user?: User,
): boolean {
  if (!user) {
    return false;
  }
  if (user.role === DefaultRoles.ADMIN) {
    return true;
  }
  if (user && entity.owner.uuid === user.uuid) {
    return true;
  }
  return entity.writeAccess.some((userGroup) => {
    return userGroup.users.some((groupUser) => groupUser.uuid === user.uuid);
  });
}

/**
 * Determines whether the provided user had write access to the provided entity.
 * If the access rights are insufficient, throws error
 *
 * @param entity - access controlled entity
 * @param user - user
 */
export function assertWriteAccess(
  entity: AccessControlledEntity,
  user?: User,
): void {
  const hasAccess = hasWriteAccess(entity, user);
  if (!hasAccess) {
    throw new ForbiddenException();
  }
}
