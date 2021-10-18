import gql from "graphql-tag";

export const ALL_USERS = {
    query: gql`
        query{
            allUsers{
                id
                name
                age
                __typename
            }
        }
        `,
    tables: ['user'],
    cacheLocation: 'allUsers'
}


export const QUERIES = [ALL_USERS];
