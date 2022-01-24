import gql from 'graphql-tag';

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
    query getMyCompany($companyUuid: String){
      getMyCompany(companyUuid: $companyUuid){
        uuid
        readable_id
        first_name
        last_name
        __typename
      }
    }
  `,
  tables: ['company'],
  cacheLocation: 'getMyCompany'
}

const COMPANY_QUERIES = [
  ALL_COMPANIES,
  COMPANY,
  MY_COMPANY
]


export default COMPANY_QUERIES
