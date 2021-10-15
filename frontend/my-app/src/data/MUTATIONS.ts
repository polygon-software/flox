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

export const DELETE_USER = gql`
    mutation deleteUser($id: ID!){
        remove (deleteUserInput: {userId: $id}) {
            id
        }
    }
`

export const MUTATIONS = [CREATE_USER, DELETE_USER]
