import gql from "graphql-tag";

export const ADD_USER = gql`
    mutation($name: String!, $age: Int!){
        create (createUserInput: {name: $name, age: $age}) {
            id
            name
            age
        }
    }
`
