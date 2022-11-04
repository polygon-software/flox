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

export async function fetchUserGroup(uuid: string): Promise<UserGroupEntity> {
  const { data } = await executeQuery<UserGroupEntity>(GET_USER_GROUP, {
    uuid,
  });
  return data;
}

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

export async function fetchUserGroups(
  uuids?: string[]
): Promise<UserGroupEntity[]> {
  const { data } = await executeQuery<UserGroupEntity[]>(GET_USER_GROUPS, {
    uuids,
  });
  return data;
}

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

export async function deleteUserGroup(
  uuid: string
): Promise<UserGroupEntity | null> {
  const { data } = await executeMutation<UserGroupEntity>(DELETE_USER_GROUP, {
    uuid,
  });
  return data ?? null;
}

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
