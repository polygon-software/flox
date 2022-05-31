import {executeMutation, executeQuery} from 'src/helpers/data-helpers';
import {mapUser} from 'src/helpers/mapping-helpers';
import {MY_USER} from 'src/data/queries/USER';
import {CREATE_USER} from 'src/data/mutations/USER';

/**
 * This file contains all helper functions for fetching data using GraphQL queries
 */

/**
 * Fetch the logged-in user
 * @returns {Promise<User|null>} - the logged-in user
 */
export async function fetchMyUser() {
  const queryResult = await executeQuery(MY_USER);
  const user = (
    queryResult.data ? queryResult.data[MY_USER.cacheLocation] : null
  ) as Record<string, unknown> | null;
  return user ? mapUser(user) : null;
}

/**
 * Creates a user
 * @param {string} username - user's username (may be identical to e-mail)
 * @param {string} email - user's e-mail address
 * @param {string} cognitoUuid - user's Cognito UUID
 * @returns {Promise<User|null>} - the newly created user
 */
export async function createUser(username: string, email: string, cognitoUuid: string) {
  const mutationResult = await executeMutation(CREATE_USER, {
    username,
    email,
    cognitoUuid
  });
  const user = (
    mutationResult?.data ? (mutationResult as Record<string, Record<string, unknown>>).data[CREATE_USER.cacheLocation] : null
  ) as Record<string, unknown> | null;
  return user ? mapUser(user) : null;
}
