import { executeQuery } from 'src/apollo/query';
import UserGroupEntity from 'src/flox/modules/access-control/entities/user-group.entity';
import {
  GET_ALL_USER_GROUPS,
  GET_MY_USER_GROUPS,
  GET_USER_GROUP,
  GET_USER_GROUPS,
  GET_USER_GROUPS_FOR_USER,
} from 'src/flox/modules/access-control/access-control.query';
import { executeMutation } from 'src/apollo/mutation';
import {
  ADD_USER_TO_USER_GROUP,
  ADD_USERS_TO_USER_GROUP,
  CREATE_USER_GROUP,
  DELETE_USER_GROUP,
  REMOVE_USER_FROM_USER_GROUP,
  UPDATE_USER_GROUP,
} from 'src/flox/modules/access-control/access-control.mutation';

/**
 * Fetches the user groups given its uuid
 *
 * @param uuid - uuid of group
 * @returns user group
 */
export async function fetchUserGroup(uuid: string): Promise<UserGroupEntity> {
  const { data } = await executeQuery<UserGroupEntity>(GET_USER_GROUP, {
    uuid,
  });
  return data;
}

/**
 * Fetches all user groups a given user belongs to
 *
 * @param userUuid - uuid of user
 * @param skip - pagination skip
 * @param take - pagination take
 * @returns user groups of given user
 */
export async function fetchUserGroupsForUser(
  userUuid: string,
  skip?: number,
  take?: number
): Promise<UserGroupEntity[]> {
  const { data } = await executeQuery<UserGroupEntity[]>(
    GET_USER_GROUPS_FOR_USER,
    {
      userUuid,
      skip,
      take,
    }
  );
  return data;
}

/**
 * Fetch user groups of logged in user
 *
 * @param skip - pagination skip
 * @param take - pagination take
 * @returns user groups of logged in user
 */
export async function fetchMyUserGroups(
  skip?: number,
  take?: number
): Promise<UserGroupEntity[]> {
  const { data } = await executeQuery<UserGroupEntity[]>(GET_MY_USER_GROUPS, {
    skip,
    take,
  });
  return data;
}

/**
 * Fetch multiple user groups given their uuids
 *
 * @param uuids - uuids of user groups
 * @returns user groups for the given uuids
 */
export async function fetchUserGroups(
  uuids?: string[]
): Promise<UserGroupEntity[]> {
  const { data } = await executeQuery<UserGroupEntity[]>(GET_USER_GROUPS, {
    uuids,
  });
  return data;
}

/**
 * Fetches all user groups
 *
 * @param skip - pagination skip
 * @param take - pagination take
 * @returns page of user groups
 */
export async function fetchAllUserGroups(
  skip?: number,
  take?: number
): Promise<UserGroupEntity[]> {
  const { data } = await executeQuery<UserGroupEntity[]>(GET_ALL_USER_GROUPS, {
    skip,
    take,
  });
  return data;
}

/**
 * Creates a new user group and populates it with given users
 *
 * @param name - name of user group
 * @param users - list of user uuids to populate group with
 * @returns created user group
 */
export async function createUserGroup(
  name: string,
  users: string[]
): Promise<UserGroupEntity | null> {
  const { data } = await executeMutation<UserGroupEntity>(CREATE_USER_GROUP, {
    name,
    users,
  });
  return data ?? null;
}

/**
 * Updates the name of a given user group
 *
 * @param uuid - uuid of user group
 * @param name - new name of user group
 * @returns updated user group
 */
export async function updateUserGroup(
  uuid: string,
  name: string
): Promise<UserGroupEntity | null> {
  const { data } = await executeMutation<UserGroupEntity>(UPDATE_USER_GROUP, {
    uuid,
    name,
  });
  return data ?? null;
}

/**
 * Deletes a user group
 *
 * @param uuid - uuid of user group
 * @returns deleted user group
 */
export async function deleteUserGroup(
  uuid: string
): Promise<UserGroupEntity | null> {
  const { data } = await executeMutation<UserGroupEntity>(DELETE_USER_GROUP, {
    uuid,
  });
  return data ?? null;
}

/**
 * Adds a user to a user group
 *
 * @param userGroupUuid - uuid of group
 * @param userUuid - uuid of user to be added
 * @returns group with user now in it
 */
export async function addUserToUserGroup(
  userGroupUuid: string,
  userUuid: string
): Promise<UserGroupEntity | null> {
  const { data } = await executeMutation<UserGroupEntity>(
    ADD_USER_TO_USER_GROUP,
    {
      userGroupUuid,
      userUuid,
    }
  );
  return data ?? null;
}

/**
 * Adds multiple users to a user group
 *
 * @param userGroupUuid - uuid of group
 * @param userUuids - uuids of users to be added
 * @returns group with users now in it
 */
export async function addUsersToUserGroup(
  userGroupUuid: string,
  userUuids: string[]
): Promise<UserGroupEntity | null> {
  const { data } = await executeMutation<UserGroupEntity>(
    ADD_USERS_TO_USER_GROUP,
    {
      userGroupUuid,
      userUuids,
    }
  );
  return data ?? null;
}

/**
 * Removes user from a user group
 *
 * @param userGroupUuid - uuid of group
 * @param userUuid - uuid of user to be removed
 * @returns group with user no longer in it
 */
export async function removeUserFromUserGroup(
  userGroupUuid: string,
  userUuid: string
): Promise<UserGroupEntity | null> {
  const { data } = await executeMutation<UserGroupEntity>(
    REMOVE_USER_FROM_USER_GROUP,
    {
      userGroupUuid,
      userUuid,
    }
  );
  return data ?? null;
}
