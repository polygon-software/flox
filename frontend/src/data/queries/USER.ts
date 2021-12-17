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

export const ALL_PLAYERS = {
  query: gql`
    query{
      allPlayers{
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
  cacheLocation: 'allPlayers'
}

export const USER_QUERIES: QueryObject[] = [
  MY_USER,
  ALL_PLAYERS
]
