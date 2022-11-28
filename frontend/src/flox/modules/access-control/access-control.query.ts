import { gql } from '@apollo/client/core';

import { QueryObject } from 'src/apollo/query';

import { TABLES } from '../../enum/TABLES';

export const GET_USER_GROUP = {
  query: gql`
    query UserGroup($uuid: ID!) {
      UserGroup(uuid: $uuid) {
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
  tables: [TABLES.USER_GROUP],
  cacheLocation: 'UserGroup',
};

export const GET_MY_USER_GROUPS = {
  query: gql`
    query MyUserGroups($skip: Int, $take: Int) {
      MyUserGroups(skip: $skip, take: $take) {
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
  tables: [TABLES.USER_GROUP],
  cacheLocation: 'MyUserGroups',
};

export const GET_USER_GROUPS_FOR_USER = {
  query: gql`
    query UserGroupsOfUser($skip: Int, $take: Int, $userUuid: ID!) {
      UserGroupsOfUser(skip: $skip, take: $take, userUuid: $userUuid) {
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
  tables: [TABLES.USER_GROUP],
  cacheLocation: 'UserGroupsOfUser',
};

export const GET_USER_GROUPS = {
  query: gql`
    query UserGroups($uuids: [ID!]) {
      UserGroups(uuids: $uuids) {
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
  tables: [TABLES.USER_GROUP],
  cacheLocation: 'UserGroups',
};

export const GET_ALL_USER_GROUPS = {
  query: gql`
    query AllUserGroups($take: Int, $skip: Int) {
      AllUserGroups(take: $take, skip: $skip) {
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
  tables: [TABLES.USER_GROUP],
  cacheLocation: 'AllUserGroups',
};

export const SEARCH_USER_GROUPS = {
  query: gql`
    query SearchUserGroups(
      $take: Int
      $skip: Int
      $filter: String
      $sortBy: String
      $descending: Boolean
    ) {
      SearchUserGroups(
        take: $take
        skip: $skip
        filter: $filter
        sortBy: $sortBy
        descending: $descending
      ) {
        count
        data {
          uuid
          name
          users {
            uuid
            username
            email
            role
          }
        }
        __typename
      }
    }
  `,
  tables: [TABLES.USER_GROUP],
  cacheLocation: 'SearchUserGroups',
};

export const ACCESS_CONTROL_QUERIES: QueryObject[] = [
  GET_USER_GROUP,
  GET_USER_GROUPS_FOR_USER,
  GET_MY_USER_GROUPS,
  GET_USER_GROUPS,
  GET_ALL_USER_GROUPS,
  SEARCH_USER_GROUPS,
];
