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

export const CREATE_USER = {
    mutation: gql`
        mutation createUser($createUserInput: CreateUserInput!){
            create (createUserInput: $createUserInput) {
              uuid
              username
              fullName
              email
              phone
              birthdate
              __typename
            }
        }`,
    tables: ['user'],
    type: MutationTypes.CREATE,
    cacheLocation: 'create'
}

export const DELETE_USER = {
    mutation: gql`
        mutation deleteUser($uuid: ID!){
            remove (deleteUserInput: {uuid: $uuid}) {
                uuid
            }
        }`,
    tables: ['user'],
    type: MutationTypes.DELETE,
    cacheLocation: 'remove'
}
