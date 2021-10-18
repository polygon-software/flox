import gql from "graphql-tag";
import {MutationTypes} from "@/data/DATA-DEFINITIONS";

export const CREATE_USER = {
    mutation: gql`
        mutation createUser($name: String!, $age: Int!){
            create (createUserInput: {name: $name, age: $age}) {
                id
                name
                age
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
