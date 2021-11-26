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

export const ALL_COMPANIES = {
  query: gql`
        query{
            allCompanies{
              uuid
              company_name
              first_name
              last_name
              email
              phone
              document_upload_enabled
              domicile_address{
                street
                number
                city
                zip_code
              }
              correspondence_address{
                street
                number
                city
                zip_code
              }
              documents{
                uuid
              }
              __typename
            }
        }
        `,
  tables: ['company'],
  cacheLocation: 'allCompanies'
}

export const ALL_EMPLOYEES = {
  query: gql`
        query{
            allEmployees{
              uuid
              first_name
              last_name
              function
              email
              phone
              __typename
            }
        }
        `,
  tables: ['employee'],
  cacheLocation: 'allEmployees'
}

export const MY_EMPLOYEES = {
  query: gql`
        query{
            myEmployees{
              uuid
              first_name
              last_name
              function
              email
              phone
              __typename
            }
        }
        `,
  tables: ['employee'],
  cacheLocation: 'myEmployees'
}


export const QUERIES = [ALL_USERS, ALL_COMPANIES, ALL_EMPLOYEES];
