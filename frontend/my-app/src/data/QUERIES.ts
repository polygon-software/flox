import gql from "graphql-tag";

export const ALL_USERS = gql`
    query{
        allUsers{
            id
            name
            age
        }
    }
`
