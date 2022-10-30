import { executeMutation } from 'src/apollo/mutation';
import { executeQuery } from 'src/apollo/query';
import { UserEntity } from 'src/flox/modules/auth/entities/user.entity';
import {
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
} from 'src/flox/modules/auth/user.mutation';
import {
  GET_ALL_USERS,
  GET_MULTIPLE_USERS,
  GET_MY_USER,
  SEARCH_USERS,
  GET_USER,
} from 'src/flox/modules/auth/user.query';
import CountQuery from 'src/flox/modules/interfaces/entities/count.entity';

/**
 * Fetch the logged-in user
 * @returns the logged-in user
 */
export async function fetchMyUser(): Promise<UserEntity> {
  const { data } = await executeQuery<UserEntity>(GET_MY_USER);
  return data;
}

export async function getUser(uuid: String): Promise<UserEntity> {
  const { data } = await executeQuery<UserEntity>(GET_USER, { uuid });
  return data;
}

export async function getUsers(uuids: String[]): Promise<UserEntity[]> {
  const { data } = await executeQuery<UserEntity[]>(GET_MULTIPLE_USERS, {
    uuids,
  });
  return data;
}

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
 * Creates a user
 * @param username - user's username (may be identical to e-mail)
 * @param email - user's e-mail address
 * @param cognitoUuid - user's Cognito UUID
 * @returns the newly created user
 */
export async function createUser(
  username: string,
  email: string,
  cognitoUuid: string
): Promise<UserEntity | null> {
  const { data } = await executeMutation<UserEntity>(CREATE_USER, {
    username,
    email,
    cognitoUuid,
  });
  return data ?? null;
}

export async function updateUser(
  uuid: string,
  username: string,
  email: string
): Promise<UserEntity | null> {
  const { data } = await executeMutation<UserEntity>(UPDATE_USER, {
    uuid,
    username,
    email,
  });
  return data ?? null;
}

export async function deleteUser(uuid: string): Promise<UserEntity | null> {
  const { data } = await executeMutation<UserEntity>(DELETE_USER, {
    uuid,
  });
  return data ?? null;
}
