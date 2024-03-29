import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';

import { TABLES } from '../../enum/TABLES';

/**
 * User-related mutations
 */
export const ADMIN_CREATE_USER: MutationObject = {
  mutation: gql`
    mutation AdminCreateUser(
      $username: String!
      $email: String!
      $role: Role!
      $deliveryMediums: [DeliveryMediums!]!
      $phoneNumber: String
      $lang: String
    ) {
      AdminCreateUser(
        adminCreateUserInput: {
          username: $username
          email: $email
          role: $role
          deliveryMediums: $deliveryMediums
          phoneNumber: $phoneNumber
          lang: $lang
        }
      ) {
        data {
          uuid
          username
          lang
          email
          cognitoUuid
          __typename
        }
        password
        __typename
      }
    }
  `,
  tables: [TABLES.USER],
  type: MutationTypes.CREATE,
  cacheLocation: 'AdminCreateUser',
};

export const SIGNUP_CREATE_USER: MutationObject = {
  mutation: gql`
    mutation SignupCreateUser(
      $username: String!
      $password: String!
      $email: String!
      $lang: String
    ) {
      SignupCreateUser(
        signupCreateUserInput: {
          username: $username
          password: $password
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
  cacheLocation: 'DeleteUser',
};

export const DISABLE_USER: MutationObject = {
  mutation: gql`
    mutation DisableUser($uuid: ID!) {
      DisableUser(disableUserInput: { uuid: $uuid }) {
        uuid
        email
        username
      }
    }
  `,
  tables: [], // This mutation affects only Cognito
  type: MutationTypes.UPDATE,
  cacheLocation: 'DisableUser',
};

export const ENABLE_USER: MutationObject = {
  mutation: gql`
    mutation EnableUser($uuid: ID!) {
      EnableUser(enableUserInput: { uuid: $uuid }) {
        uuid
        email
        username
      }
    }
  `,
  tables: [], // This mutation affects only Cognito
  type: MutationTypes.UPDATE,
  cacheLocation: 'EnableUser',
};

export const FORCE_USER_PASSWORD_CHANGE: MutationObject = {
  mutation: gql`
    mutation ForceUserPasswordChange($uuid: ID!) {
      ForceUserPasswordChange(forceUserPasswordChangeInput: { uuid: $uuid }) {
        uuid
      }
    }
  `,
  tables: [], // This mutation affects only Cognito
  type: MutationTypes.UPDATE,
  cacheLocation: 'ForceUserPasswordChange',
};
