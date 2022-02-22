import gql from 'graphql-tag';
import {MutationTypes} from '../DATA-DEFINITIONS';

/**
 * This file contains all valid GraphQL mutations. A mutation is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - mutation: the actual GraphQL mutation. Add __typename to the variables if the mutation UPDATES or CREATES data.
 * - tables: list of affected tables; when the mutation is executed, the corresponding queries are re-fetched.
 * - type: the mutation's type (either CREATE, DELETE or UPDATE); this determines cache handling
 * - cacheLocation: the actual GraphQL mutation's name (since cached data will be stored there)
 *
 */
export const REGISTER_USER = {
  mutation: gql`
    mutation registerUser($registerUserInput: RegisterUserInput!){
      register (registerUserInput: $registerUserInput) {
        uuid
        cognitoUuid
        email
        __typename
      }
    }`,
  tables: ['user'],
  type: MutationTypes.UPDATE,
  cacheLocation: 'register'
}

export const ADD_PERMISSION = {
  mutation: gql`
    mutation addPermission($addUserPermissionInput: AddUserPermissionInput!){
      addPermission (addUserPermissionInput: $addUserPermissionInput) {
        uuid
        username
        fullName
        email
        phone
        birthdate
        projects
        mr2000instances
        mr3000instances
        __typename
      }
    }`,
  tables: ['user'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
