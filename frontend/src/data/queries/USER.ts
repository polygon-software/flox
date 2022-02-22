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
  cacheLocation: 'isEmailAllowed'
}

export const MY_USER = {
  query: gql`
    query {
      myUser {
        uuid
        role
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

export const USER_DEVICES = {
  query: gql`
    query getUserDevices($uuid: ID!){
      getUserDevices(uuid: $uuid){
      ...on MR2000{
        cli
      }
      ... on MR3000{
        cli
      }
      __typename
    }}
  `,
  tables: ['user'],
  cacheLocation: 'getUserDevices',
};

export const MY_DEVICES = {
  query: gql`
    query{
      myDevices{
      ...on MR2000{
        cli
      }
      ... on MR3000{
        cli
      }
      __typename
    }}
  `,
  tables: ['user'],
  cacheLocation: 'getUserDevices',
};

export const USER_PROJECTS = {
  query: gql`
    query getUserProjects($uuid: ID!){
      getUserProjects(uuid: $uuid){
        name
        mr2000instances{
          cli
        }
        mr3000instances{
          cli
        }
      __typename
    }}
  `,
  tables: ['user'],
  cacheLocation: 'getUserProjects',
};

export const MY_PROJECTS = {
  query: gql`
    query{
      myProjects{
        name
        mr2000instances{
          cli
        }
        mr3000instances{
          cli
        }
        __typename
      }}
  `,
  tables: ['user'],
  cacheLocation: 'myProjects',
};

export const USER_QUERIES: QueryObject[] = [
  MY_USER,
  ALL_USERS,
  USER,
  USER_DEVICES,
  USER_PROJECTS,
  MY_PROJECTS,
  MY_DEVICES
];
