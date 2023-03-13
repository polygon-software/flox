import { gql } from '@apollo/client/core';

import { QueryObject } from 'src/apollo/query';

import { TABLES } from '../../enum/TABLES';

/**
 * User-related queries
 */

export const GET_MY_USER: QueryObject = {
  query: gql`
    query MyUser {
      MyUser {
        uuid
        username
        lang
        cognitoUuid
        email
        role
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  cacheLocation: 'MyUser',
};

export const GET_USER: QueryObject = {
  query: gql`
    query User($uuid: ID!) {
      User(uuid: $uuid) {
        uuid
        username
        lang
        cognitoUuid
        email
        role
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  cacheLocation: 'User',
};

export const GET_MULTIPLE_USERS: QueryObject = {
  query: gql`
    query Users($uuids: [ID!]) {
      Users(uuids: $uuids) {
        uuid
        username
        lang
        cognitoUuid
        email
        role
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  cacheLocation: 'allUsers',
};

export const GET_ALL_USERS: QueryObject = {
  query: gql`
    query AllUsers($take: Int, $skip: Int) {
      AllUsers(take: $take, skip: $skip) {
        uuid
        username
        lang
        cognitoUuid
        email
        role
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  cacheLocation: 'allUsers',
};

export const SEARCH_USERS: QueryObject = {
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
          lang
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

export const IS_USER_ENABLED: QueryObject = {
  query: gql`
    query IsUserEnabled($uuid: ID!) {
      IsUserEnabled(uuid: $uuid)
    }
  `,
  tables: [TABLES.USER],
  cacheLocation: 'User',
};

export const USER_QUERIES: QueryObject[] = [
  GET_MY_USER,
  GET_USER,
  GET_MULTIPLE_USERS,
  GET_ALL_USERS,
  SEARCH_USERS,
  IS_USER_ENABLED,
];
