import gql from 'graphql-tag';
import {MutationTypes} from '../DATA-DEFINITIONS';

export const DISABLE_USER = {
  mutation: gql`
    mutation disableUser($uuid: ID!, $role: Roles!){
      disableUser(disableUserInput: {uuid: $uuid, role: $role}) {
        uuid
        banned_at
        __typename
      }
    }`,
  tables: ['user'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
