import gql from "graphql-tag";

// TODO structure?
export const USER_ADDED = gql`
    subscription onUserAdded {
        userAdded {
            id
            name
            age
        }
    }

`
