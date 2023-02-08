import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';
import { TABLES } from 'src/flox/TABLES';

/**
 * User-related mutations
 */
export const CREATE_USER: MutationObject = {
  mutation: gql`
    mutation CreateUser(
      $username: String!
      $email: String!
      $cognitoUuid: String!
      $lang: String
    ) {
      CreateUser(
        createUserInput: {
          username: $username
          email: $email
          cognitoUuid: $cognitoUuid
          lang: $lang
        }
      ) {
        uuid
        username
        lang
        email
        cognitoUuid
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  type: MutationTypes.CREATE,
  cacheLocation: 'CreateUser',
};

export const UPDATE_USER: MutationObject = {
  mutation: gql`
    mutation UpdateUser(
      $uuid: ID!
      $username: String
      $email: String
      $lang: String
    ) {
      UpdateUser(
        updateUserInput: {
          uuid: $uuid
          username: $username
          email: $email
          lang: $lang
        }
      ) {
        uuid
        username
        lang
        email
        cognitoUuid
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  type: MutationTypes.UPDATE,
  cacheLocation: 'UpdateUser',
};

export const DELETE_USER: MutationObject = {
  mutation: gql`
    mutation DeleteUser($uuid: ID!) {
      DeleteUser(deleteUserInput: { uuid: $uuid }) {
        uuid
      }
    }
  `,
  tables: [TABLES.USER],
  type: MutationTypes.DELETE,
  cacheLocation: 'deleteUser',
};
