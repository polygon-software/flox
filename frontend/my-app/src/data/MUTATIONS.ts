import gql from "graphql-tag";
import {MutationTypes} from "@/data/data-helpers";

export const CREATE_USER = {
    mutation: gql`
        mutation createUser($name: String!, $age: Int!){
            create (createUserInput: {name: $name, age: $age}) {
                id
                name
                age
            }
        }`,
    tables: ['users'],
    type: MutationTypes.CREATE
}

export const DELETE_USER = gql`
    mutation deleteUser($id: ID!){
        remove (deleteUserInput: {userId: $id}) {
            id
        }
    }
`
