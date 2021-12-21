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
    query company($uuid: ID, $cognito_id: ID){
      company(uuid: $uuid, cognito_id: $cognito_id){
        uuid
        readable_id
        first_name
        last_name
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

export const MY_COMPANY = {
  query: gql`
    query myCompany{
      myCompany{
        uuid
        readable_id
        first_name
        last_name
        __typename
      }
    }
  `,
  tables: ['company'],
  cacheLocation: 'myCompany'
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

export const MY_EMPLOYEE = {
  query: gql`
    query{
      myEmployee{
        uuid
        first_name
        last_name
        readable_id
        email
        company{
          __typename
          uuid
          readable_id
        }
        __typename
      }
    }
    `,
  tables: ['employee'],
  cacheLocation: 'myEmployee'
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

export const MY_USER = {
  query: gql`
    query{
      getMyUser{
        uuid
        role
        fk
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'getMyUser'
}

export const MY_DOSSIERS = {
  query: gql`
        query{
            myDossiers{
              uuid
              created_at
              first_name
              last_name
              original_bank{
                __typename
                uuid
                name
                abbreviation
              }
              property_address{
                __typename
                uuid
                city
              }
              loan_sum
              status
              offers{
                __typename
                uuid
                bank {
                  __typename
                  uuid
                  name
                  abbreviation
                }
              }
              __typename
            }
        }
  `,
  tables: ['dossier'],
  cacheLocation: 'myDossiers'
}


export const QUERIES = [ALL_USERS, ALL_COMPANIES, COMPANY, ALL_EMPLOYEES, MY_EMPLOYEES, PRIVATE_FILE, MY_DOSSIERS];
