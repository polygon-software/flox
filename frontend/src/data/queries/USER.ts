import gql from 'graphql-tag';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';

/**
 * User-related queries
 */

export const MY_USER = {
  query: gql`
    query{
      myUser{
        uuid
        role
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'myUser'
}

// TODO: actually implement separate query for players
export const ALL_PLAYERS = {
  query: gql`
    query{
      allUsers{
        uuid
        role
        createdAt
        fullName
        username
        email
        phone
        birthdate
        status
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
  cacheLocation: 'allUsers'
}

export const USER_QUERIES: QueryObject[] = [
  MY_USER,
  ALL_PLAYERS
]
