import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import User from '../entities/user.entity';
import { DefaultRoles } from '../../roles/config';

/**
 * Decides whether one user can edit the properties of another
 *
 * @param editor - user that tries to edit another user
 * @param editedUuid - uuid of user that is being edited
 * @returns whether edit should be granted
 */
export function isAllowedToManipulate(
  editor: User,
  editedUuid: string,
): boolean {
  // is only allowed to edit himself or as admin
  if (editor.role === DefaultRoles.ADMIN) {
    return true;
  }
  return editor.uuid === editedUuid;
}

/**
 * Throws error if one user tries to edit another illegally
 *
 * @param editor - user that tries to edit another user
 * @param editedUuid - uuid of user that is being edited
 */
export function assertIsAllowedToManipulate(
  editor: User,
  editedUuid: string,
): void {
  const allowEdit = isAllowedToManipulate(editor, editedUuid);
  if (!allowEdit) {
    throw new ForbiddenException();
  }
}

/**
 * Evauluates the basic authentication header sent by the ERP client.
 *
 * @param authentication - the authentication header
 */
export function basicAuth(authentication: string): void {
  const encoded = Buffer.from(
    authentication.split(' ')[1],
    'base64',
  ).toString();
  const [username, password] = encoded.split(':');
  if (
    !(
      username === process.env.ERP_API_USERNAME &&
      password === process.env.ERP_API_PASSWORD
    )
  ) {
    throw new UnauthorizedException();
  }
}
