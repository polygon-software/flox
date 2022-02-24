import gql from 'graphql-tag';
import { QueryObject } from 'src/data/DATA-DEFINITIONS';

/**
 * User-related queries
 */


export const EMAIL_ALLOWED = {
  query : gql`
    query isEmailAllowed($email: String!){
      isEmailAllowed (email: $email)
    }`,
  tables: ['user'],
  cacheLocation: 'isEmailAllowed',
}

export const MY_USER = {
  query: gql`
    query {
      myUser {
        uuid
        role
        username
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
        role
        createdAt
        fullName
        username
        email
        phone
        birthdate
        address {
          uuid
          street
          number
          city
          zipCode
          __typename
        }
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'allUsers',
};

export const USER = {
  query: gql`
    query user($uuid: ID!){
      user(uuid: $uuid) {
        uuid
        role
        createdAt
        fullName
        username
        email
        phone
        birthdate
        address {
          uuid
          street
          number
          city
          zipCode
          __typename
        }
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'user',
};

export const USER_QUERIES: QueryObject[] = [
  MY_USER,
  ALL_USERS,
  USER,
];
