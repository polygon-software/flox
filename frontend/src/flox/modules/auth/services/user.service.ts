import {UserEntity} from 'src/flox/modules/auth/entities/user.entity';
import {MY_USER} from 'src/flox/modules/auth/user.query';
import {CREATE_USER} from 'src/flox/modules/auth/user.mutation';
import {executeQuery} from 'src/apollo/query';
import {executeMutation} from 'src/apollo/mutation';

/**
 * Fetch the logged-in user
 * @returns {Promise<UserEntity|null>} - the logged-in user
 */
export async function fetchMyUser() {
  const { data } = await executeQuery<UserEntity>(MY_USER);
  return data;
}

/**
 * Creates a user
 * @param {string} username - user's username (may be identical to e-mail)
 * @param {string} email - user's e-mail address
 * @param {string} cognitoUuid - user's Cognito UUID
 * @returns {Promise<UserEntity|null>} - the newly created user
 */
export async function createUser(username: string, email: string, cognitoUuid: string): Promise<UserEntity|null> {
  const { data } = await executeMutation<UserEntity>(CREATE_USER, {
    username,
    email,
    cognitoUuid,
  });
  return data ?? null;
}
