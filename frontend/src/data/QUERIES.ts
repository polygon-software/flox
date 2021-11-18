import gql from 'graphql-tag';

/**
 * This file contains all valid GraphQL queries. A query is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - query: the actual GraphQL query. Add __typename to the variables in order for caching to work as expected
 * (auto-update on edit)
 * - tables: list of affected tables; when a mutation changes one of these tables, the query is re-fetched.
 * - cacheLocation: the actual GraphQL query's name (since cached data will be stored there)
 *
 * When adding a new query, also add it to the QUERIES array at the bottom of this file.
 */

export const ALL_USERS = {
    query: gql`
        query{
            allUsers{
                uuid
                name
                age
                __typename
            }
        }
        `,
    tables: ['user'],
    cacheLocation: 'allUsers'
}

export const ALL_PRODUCTS = {
    query: gql`
        query{
            allProducts{
              uuid
              title
              description
              value
              start
              end
              __typename
            }
        }
        `,
    tables: ['product'],
    cacheLocation: 'allProducts'
}


export const QUERIES = [ALL_USERS, ALL_PRODUCTS];
