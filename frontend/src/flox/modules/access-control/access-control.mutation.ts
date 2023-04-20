import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';

import { ALL_TABLES } from '../../enum/TABLES';

export const CREATE_USER_GROUP: MutationObject = {
  mutation: gql`
    mutation CreateUserGroup($name: String!, $users: [ID!]) {
      CreateUserGroup(createUserGroupInput: { name: $name, users: $users }) {
        uuid
        name
        users {
          uuid
          username
          email
          role
        }
        __typename
      }
    }
  `,
  tables: ALL_TABLES,
  type: MutationTypes.CREATE,
  cacheLocation: 'CreateUserGroup',
};

export const UPDATE_USER_GROUP: MutationObject = {
  mutation: gql`
    mutation UpdateUserGroup($uuid: ID!, $name: String!) {
      UpdateUserGroup(updateUserGroupInput: { name: $name, uuid: $uuid }) {
        uuid
        name
        users {
          uuid
          username
          email
          role
        }
        __typename
      }
    }
  `,
  tables: ALL_TABLES,
  type: MutationTypes.DEVALIDATINGUPDATE,
  cacheLocation: 'UpdateUserGroup',
};

export const DELETE_USER_GROUP: MutationObject = {
  mutation: gql`
    mutation DeleteUserGroup($uuid: ID!) {
      DeleteUserGroup(deleteInput: { uuid: $uuid }) {
        uuid
        name
        __typename
      }
    }
  `,
  tables: ALL_TABLES,
  type: MutationTypes.DELETE,
  cacheLocation: 'DeleteUserGroup',
};

export const ADD_USER_TO_USER_GROUP: MutationObject = {
  mutation: gql`
    mutation AddUserToUserGroup($userUuid: ID!, $userGroupUuid: ID!) {
      AddUserToUserGroup(
        addUserToUserGroupInput: {
          userGroupUuid: $userGroupUuid
          userUuid: $userUuid
        }
      ) {
        uuid
        name
        users {
          uuid
          username
          email
          role
        }
        __typename
      }
    }
  `,
  tables: ALL_TABLES,
  type: MutationTypes.DEVALIDATINGUPDATE,
  cacheLocation: 'AddUserToUserGroup',
};

export const ADD_USERS_TO_USER_GROUP: MutationObject = {
  mutation: gql`
    mutation AddUsersToUserGroup($userUuids: [ID!]!, $userGroupUuid: ID!) {
      AddUsersToUserGroup(
        addUsersToUserGroupInput: {
          userGroupUuid: $userGroupUuid
          userUuids: $userUuids
        }
      ) {
        uuid
        name
        users {
          uuid
          username
          email
          role
        }
        __typename
      }
    }
  `,
  tables: ALL_TABLES,
  type: MutationTypes.DEVALIDATINGUPDATE,
  cacheLocation: 'AddUsersToUserGroup',
};

export const REMOVE_USER_FROM_USER_GROUP: MutationObject = {
  mutation: gql`
    mutation RemoveUserFromUserGroup($userUuid: ID!, $userGroupUuid: ID!) {
      RemoveUserFromUserGroup(
        removeUserFromUserGroupInput: {
          userGroupUuid: $userGroupUuid
          userUuid: $userUuid
        }
      ) {
        uuid
        name
        users {
          uuid
          username
          email
          role
        }
        __typename
      }
    }
  `,
  tables: ALL_TABLES,
  type: MutationTypes.DEVALIDATINGUPDATE,
  cacheLocation: 'RemoveUserFromUserGroup',
};
