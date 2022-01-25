import gql from 'graphql-tag';

export const ALL_USERS = {
  query: gql`
    query{
      allUsers{
        uuid
        fk
        role
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'allUsers'
}

export const MY_USER = {
  query: gql`
    query{
      getMyUser{
        uuid
        role
        fk
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'getMyUser'
}

const USER_QUERIES = [
  ALL_USERS,
  MY_USER
]


export default USER_QUERIES
