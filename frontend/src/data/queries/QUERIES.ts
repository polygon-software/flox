import gql from 'graphql-tag';

/**
 * This file contains all valid GraphQL queries. A query is structure as follows
 * (see also DATA-DEFINITIONS.ts):
 * - query: the actual GraphQL query. Add __typename to the variables in order for caching to work as expected
 *  this is also needed on sub-queries!
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
        fk
        role
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
        readable_id
        company_name
        first_name
        last_name
        email
        phone
        language
        uid
        creation_state
        domicile_address{
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        correspondence_address{
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        documents{
          uuid
          key
          __typename
        }
        __typename
      }
    }
        `,
  tables: ['company'],
  cacheLocation: 'allCompanies'
}

export const COMPANY = {
  query: gql`
    query company($uuid: ID){
      company(uuid: $uuid){
        uuid
        documents{
          uuid
          key
          __typename
        }
        __typename
      }
    }
  `,
  tables: ['company', 'documents'],
  cacheLocation: 'company'
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

export const PRIVATE_FILE = {
  query: gql`
    query getPrivateFile($uuid: ID!){
      getPrivateFile(uuid: $uuid){
        uuid
        url
        key
        __typename
      }
    }
  `,
  tables: ['private_file'],
  cacheLocation: 'getPrivateFile'
}

export const ALL_OFFERS = {

}

export const QUERIES = [ALL_USERS, ALL_COMPANIES, COMPANY, ALL_EMPLOYEES, MY_EMPLOYEES, PRIVATE_FILE];
