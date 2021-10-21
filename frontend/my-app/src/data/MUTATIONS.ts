import gql from 'graphql-tag';
import {MutationTypes} from './DATA-DEFINITIONS';

/**
 * This file contains all valid GraphQL mutations. A mutation is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - mutation: the actual GraphQL mutation. Add __typename to the variables if the mutation only UPDATES data.
 * TODO __typename is also needed for create, why....
 * - tables: list of affected tables; when the mutation is executed, the corresponding queries are re-fetched.
 * - type: the mutation's type (either CREATE, DELETE or UPDATE); this determines cache handling
 * - cacheLocation: the actual GraphQL mutation's name (since cached data will be stored there)
 *
 */

export const CREATE_USER = {
    mutation: gql`
        mutation createUser($name: String!, $age: Int!){
            create (createUserInput: {name: $name, age: $age}) {
                id
                name
                age
                __typename
            }
        }`,
    tables: ['user'],
    type: MutationTypes.CREATE,
    cacheLocation: 'create'
}

export const UPDATE_USER = {
    mutation: gql`
        mutation updateUser($id: ID!, $name: String, $age: Int){
            update (updateUserInput: {userId: $id, name: $name, age: $age}) {
                id
                name
                age
                __typename
            }
        }`,
    tables: ['user'],
    type: MutationTypes.UPDATE,
    cacheLocation: 'update'
}

export const DELETE_USER = {
    mutation: gql`
        mutation deleteUser($id: ID!){
            remove (deleteUserInput: {userId: $id}) {
                id
            }
        }`,
    tables: ['user'],
    type: MutationTypes.DELETE,
    cacheLocation: 'remove'
}
