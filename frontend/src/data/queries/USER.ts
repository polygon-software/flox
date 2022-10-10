import gql from 'graphql-tag';
import { QueryObject } from 'src/data/DATA-DEFINITIONS';

/**
 * User-related queries
 */

export const MY_USER = {
  query: gql`
    query {
      myUser {
        uuid
        username
        cognitoUuid
        email
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'myUser',
};

export const ALL_USERS = {
  query: gql`
    query {
      allUsers {
        uuid
        username
        cognitoUuid
        email
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'allUsers',
};

export const QUERY_USERS = {
  query: gql`
    query queryUsers($skip: Float, $limit: Float, $filter: String, $sortBy: String, $descending: Boolean) {
      queryUsers(skip: $skip, limit: $limit, filter: $filter, sortBy: $sortBy, descending: $descending) {
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
  tables: ['user'],
  cacheLocation: 'queryUsers',
};

export const USER_QUERIES: QueryObject[] = [MY_USER, ALL_USERS];
