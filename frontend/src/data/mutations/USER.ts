import gql from 'graphql-tag';
import {MutationTypes} from '../DATA-DEFINITIONS';

export const DISABLE_USER = {
  mutation: gql`
    mutation disableUser($uuid: ID!, $role: Roles!){
      disableUser(disableUserInput: {uuid: $uuid, role: $role}) {
        ... on Employee {
          uuid
          banned_at
          __typename
        }
        ... on Company {
          uuid
          banned_at
          __typename
        }
        ... on SoiEmployee {
          uuid
          banned_at
          __typename
        }
        ... on Bank {
          uuid
          banned_at
          __typename
        }
      }
    }`,
  tables: ['user', 'soi_employee', 'employee', 'company', 'bank'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
export const VERIFY_EMAIL = {
  mutation: gql`
    mutation verifyUser{
      verifyUser
    }
  `,
  tables: [],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
