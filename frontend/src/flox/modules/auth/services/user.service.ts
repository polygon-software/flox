import AdminCreatedUser from '../data/types/AdminCreatedUser';
import DELIVERY_MEDIUMS from '../../../enum/DELIVERY_MEDIUMS';
import ROLE from '../../../enum/USER_ROLES';
import { executeMutation } from '../../../../apollo/mutation';
import { executeQuery } from '../../../../apollo/query';
import UserEntity from '../entities/user.entity';
import {
  ADMIN_CREATE_USER,
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
} from '../user.mutation';
import {
  GET_ALL_USERS,
  GET_MULTIPLE_USERS,
  GET_MY_USER,
  GET_USER,
  SEARCH_USERS,
} from '../user.query';
import CountQuery from '../../interfaces/entities/count.entity';

/**
 * Fetch the logged-in user
 *
 * @returns the logged-in user
 */
export async function fetchMyUser(): Promise<UserEntity> {
  const { data } = await executeQuery<UserEntity>(GET_MY_USER);
  return data;
}

/**
 * Get a certain user by its uuid
 *
 * @param uuid - uuid of user to fetch
 * @returns user
 */
export async function getUser(uuid: string): Promise<UserEntity> {
  const { data } = await executeQuery<UserEntity>(GET_USER, { uuid });
  return data;
}

/**
 * Get multiple users by their uuids
 *
 * @param uuids - uuids of users
 * @returns users
 */
export async function getUsers(uuids: string[]): Promise<UserEntity[]> {
  const { data } = await executeQuery<UserEntity[]>(GET_MULTIPLE_USERS, {
    uuids,
  });
  return data;
}

/**
 * Get all users with pagination
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @returns page of users
 */
export async function getAllUsers(
  take: number,
  skip: number
): Promise<UserEntity[]> {
  const { data } = await executeQuery<UserEntity[]>(GET_ALL_USERS, {
    take,
    skip,
  });
  return data;
}

/**
 * Search users
 *
 * @param take - pagination take
 * @param skip - pagination skip
 * @param filter - search input for username
 * @param sortBy - column to sort results by
 * @param descending - sort ascending or descending
 * @returns search results
 */
export async function searchUsers(
  take: number,
  skip: number,
  filter: string,
  sortBy: string,
  descending = false
): Promise<CountQuery<UserEntity>> {
  const { data } = await executeQuery<CountQuery<UserEntity>>(SEARCH_USERS, {
    take,
    skip,
    filter,
    sortBy,
    descending,
  });
  return data;
}

/**
 * Creates a user as an admin
 *
 * @param username - user's username (might be identical to e-mail)
 * @param email - user's e-mail address
 * @param role - the user's role
 * @param deliveryMediums - medium to use to deliver user's new login information (sms, email, both or none)
 * @param [phoneNumber] - number to send the SMS invitation to
 * @param [lang] - user's language
 * @returns the newly created user
 */
export async function adminCreateUser(
  username: string,
  email: string,
  role: ROLE,
  deliveryMediums: DELIVERY_MEDIUMS[],
  phoneNumber?: string,
  lang?: string
): Promise<AdminCreatedUser | null> {
  const { data } = await executeMutation<AdminCreatedUser>(ADMIN_CREATE_USER, {
    username,
    email,
    role,
    deliveryMediums,
    phoneNumber,
    lang,
  });
  return data ?? null;
}

/**
 * Creates a user
 *
 * @param username - user's username (might be identical to e-mail)
 * @param email - user's e-mail address
 * @param cognitoUuid - user's Cognito UUID
 * @param [lang] - user's language
 * @returns the newly created user
 */
export async function createUser(
  username: string,
  email: string,
  cognitoUuid: string,
  lang?: string
): Promise<UserEntity | null> {
  const { data } = await executeMutation<UserEntity>(CREATE_USER, {
    username,
    email,
    cognitoUuid,
    lang,
  });
  return data ?? null;
}

/**
 * Update an existing user
 *
 * @param uuid - users uuid
 * @param user - contains updated info about user
 * @param user.username - update username
 * @param user.email - update email
 * @param user.lang - update default locale
 * @returns updated user
 */
export async function updateUser(
  uuid: string,
  {
    username,
    email,
    lang,
  }: {
    username?: string;
    email?: string;
    lang?: string;
  }
): Promise<UserEntity | null> {
  const { data } = await executeMutation<UserEntity>(UPDATE_USER, {
    uuid,
    username,
    email,
    lang,
  });
  return data ?? null;
}

/**
 * Delete a user by its uuid
 *
 * @param uuid - uuid of user to delete
 * @returns deleted user
 */
export async function deleteUser(uuid: string): Promise<UserEntity | null> {
  const { data } = await executeMutation<UserEntity>(DELETE_USER, {
    uuid,
  });
  return data ?? null;
}

/**
 * Generates an avatar image for a user given its uuid
 *
 * @param uuid - uuid of user
 * @returns url that can be used as an image source for an avatar
 */
export function avatarForUser(uuid: string): string {
  const base = 'https://source.boringavatars.com/beam/52/';
  return `${base}${uuid}?colors=388087,00a0b0,6fb3b8,326e73,388087,c2edce`;
}
