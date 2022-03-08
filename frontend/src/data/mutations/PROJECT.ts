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
export const CREATE_PROJECT = {
  mutation: gql`
    mutation createProject($createProjectInput: CreateProjectInput!){
      createProject (createProjectInput: $createProjectInput) {
        uuid
        name
        mr2000instances
        mr3000instances
        __typename
      }
    }`,
  tables: ['project'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createProject'
}

export const REMOVE_DEVICE_FROM_PROJECT = {
  mutation: gql`
    mutation removeDeviceFromProject($uuid: ID!, $cli: String!){
      removeDeviceFromProject (removeDeviceFromProjectInput: {uuid: $uuid, cli: $cli}) {
        uuid
        name
        mr2000instances
        mr3000instances
        __typename
      }
    }`,
  tables: ['project'],
  type: MutationTypes.UPDATE,
  cacheLocation: undefined
}
