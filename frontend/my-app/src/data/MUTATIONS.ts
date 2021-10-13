import gql from "graphql-tag";

export const CREATE_USER = gql`
    mutation createUser($name: String!, $age: Int!){
        create (createUserInput: {name: $name, age: $age}) {
            id
            name
            age
        }
    }
`

export const DELETE_USER = gql`
    mutation deleteUser($id: ID!){
        remove (deleteUserInput: {userId: $id}) {
            id
        }
    }
`
