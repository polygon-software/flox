import gql from 'graphql-tag';

export const MY_DOSSIERS = {
  query: gql`
    query getMyDossiers{
      getMyDossiers{
        uuid
        first_name
        last_name
        email
        phone
        birthdate
        address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          abbreviation
          name
          __typename
        }
        non_arrangeable
        status
        employee {
          uuid
          __typename
        }
        documents{
          uuid
          __typename
        }
        final_document{
          uuid
          __typename
        }
        __typename
        offers{
          __typename
          uuid
          status
        }
        non_arrangeable
        status
        __typename
      }
    }
  `,
  tables: ['dossier'],
  cacheLocation: 'getMyDossiers'
}

export const REJECTED_DOSSIERS = {
  query: gql`
    query{
      getRejectedDossiers{
        uuid
        employee {
          uuid
          __typename
        }
        first_name
        last_name
        email
        phone
        birthdate
        address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          abbreviation
          name
          __typename
        }
        non_arrangeable
        status
        employee {
          uuid
          __typename
        }
        documents{
          uuid
          __typename
        }
        final_document{
          uuid
          __typename
        }
        __typename
        offers{
          __typename
          uuid
          status
        }
        non_arrangeable
        status
        __typename
      }
    }
  `,
  tables: ['dossier'],
  cacheLocation: 'getRejectedDossiers'
}

export const DOSSIERS_BANK = {
  query: gql`
    query allDossiersBank {
      allDossiersBank{
        uuid
        employee {
          uuid
          __typename
        }
        first_name
        last_name
        email
        phone
        birthdate
        address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          abbreviation
          name
          __typename
        }
        non_arrangeable
        status
        employee {
          uuid
          __typename
        }
        documents{
          uuid
          __typename
        }
        final_document{
          uuid
          __typename
        }
        __typename
        offers{
          __typename
          uuid
          status
        }
        non_arrangeable
        status
        __typename
      }
    }
  `,
  tables: ['dossier'],
  cacheLocation: 'allDossiersBank'
}

export const GET_DOSSIER = {
  query: gql`
    query getDossier($uuid: ID!) {
      getDossier(getDossierInput: {uuid: $uuid}) {
        uuid
        employee {
          uuid
          __typename
        }
        first_name
        last_name
        email
        phone
        birthdate
        address {
          uuid
          street
          number
          city
          zip_code
          __typename
        }
        original_bank {
          uuid
          abbreviation
          name
          __typename
        }
        non_arrangeable
        status
        employee {
          uuid
          __typename
        }
        documents{
          uuid
          __typename
        }
        final_document{
          uuid
          __typename
        }
        __typename
        offers{
          __typename
          uuid
          status
        }
        non_arrangeable
        status
        __typename
      }
    }
  `,
  tables: ['dossier'],
  cacheLocation: 'getDossier'
}

const DOSSIER_QUERIES = [
  MY_DOSSIERS,
  REJECTED_DOSSIERS,
  DOSSIERS_BANK,
  GET_DOSSIER
]


export default DOSSIER_QUERIES
