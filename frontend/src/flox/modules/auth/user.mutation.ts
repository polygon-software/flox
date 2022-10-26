import gql from 'graphql-tag';
import { MutationTypes } from 'src/apollo/mutation';
import { TABLES } from 'src/flox/TABLES';

/**
 * User-related mutations
 */
export const CREATE_USER = {
  mutation: gql`
    mutation createUser(
      $username: String!
      $email: String!
      $cognitoUuid: String!
    ) {
      createUser(
        createUserInput: {
          username: $username
          email: $email
          cognitoUuid: $cognitoUuid
        }
      ) {
        uuid
        username
        email
        cognitoUuid
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  type: MutationTypes.CREATE,
  cacheLocation: 'createUser',
};

export const UPDATE_USER = {
  mutation: gql`
    mutation updateUser($uuid: ID!, $username: String, $email: String!) {
      updateUser(
        updateUserInput: { uuid: $uuid, username: $username, email: $email }
      ) {
        uuid
        username
        email
        cognitoUuid
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  type: MutationTypes.UPDATE,
  cacheLocation: 'updateUser',
};

export const DELETE_USER = {
  mutation: gql`
    mutation deleteUser($uuid: ID!) {
      deleteUser(deleteUserInput: { uuid: $uuid }) {
        uuid
      }
    }
  `,
  tables: [TABLES.USER],
  type: MutationTypes.DELETE,
  cacheLocation: 'deleteUser',
};
