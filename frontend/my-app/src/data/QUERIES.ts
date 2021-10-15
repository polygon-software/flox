import gql from "graphql-tag";

export const ALL_USERS = {
    query: gql`
        query{
            allUsers{
                id
                name
                age
            }
        }
        `,
    tables: ['user']
}


export const QUERIES = [ALL_USERS];
