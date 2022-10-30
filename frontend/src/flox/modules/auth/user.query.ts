import gql from 'graphql-tag';

import { QueryObject } from 'src/apollo/query';
import { TABLES } from 'src/flox/TABLES';

/**
 * User-related queries
 */

export const GET_MY_USER = {
  query: gql`
    query MyUser {
      MyUser {
        uuid
        username
        cognitoUuid
        email
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  cacheLocation: 'MyUser',
};

export const GET_USER = {
  query: gql`
    query User($uuid: ID!) {
      User(uuid: $uuid) {
        uuid
        username
        cognitoUuid
        email
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  cacheLocation: 'User',
};

export const GET_MULTIPLE_USERS = {
  query: gql`
    query Users($uuids: [ID!]) {
      Users(uuids: $uuids) {
        uuid
        username
        cognitoUuid
        email
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  cacheLocation: 'allUsers',
};

export const GET_ALL_USERS = {
  query: gql`
    query AllUsers($take: Int, $skip: Int) {
      AllUsers(take: $take, skip: $skip) {
        uuid
        username
        cognitoUuid
        email
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  cacheLocation: 'allUsers',
};

export const SEARCH_USERS = {
  query: gql`
    query SearchUsers(
      $take: Int
      $skip: Int
      $filter: String
      $sortBy: String
      $descending: Boolean
    ) {
      SearchUsers(
        take: $take
        skip: $skip
        filter: $filter
        sortBy: $sortBy
        descending: $descending
      ) {
        count
        data {
          uuid
          username
          email
          role
        }
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  cacheLocation: 'SearchUsers',
};

export const USER_QUERIES: QueryObject[] = [
  GET_MY_USER,
  GET_USER,
  GET_MULTIPLE_USERS,
  GET_ALL_USERS,
  SEARCH_USERS,
];
