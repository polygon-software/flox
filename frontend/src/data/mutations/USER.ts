import gql from 'graphql-tag';
import {MutationTypes} from '../DATA-DEFINITIONS';

export const DISABLE_USER = {
  mutation: gql`
    mutation disableUser($uuid: String!){
      disableUser(uuid: $uuid ) {
        uuid
        status
        disabledUntil
        __typename
      }
    }`,
  tables: ['user'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
