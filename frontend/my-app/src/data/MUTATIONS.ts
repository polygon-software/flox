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
