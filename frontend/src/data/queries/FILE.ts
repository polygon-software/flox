import gql from 'graphql-tag';

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

export const DOSSIER_FILE = {
  query: gql`
    query getDossierDocument($uuid: ID!){
      getDossierDocument(uuid: $uuid){
        uuid
        url
        key
        __typename
      }
    }
  `,
  tables: ['private_file'],
  cacheLocation: 'getDossierDocument'
}

export const OFFER_FILE = {
  query: gql`
    query getOfferDocument($uuid: ID!){
      getOfferDocument(uuid: $uuid){
        uuid
        url
        key
        __typename
      }
    }
  `,
  tables: ['private_file'],
  cacheLocation: 'getOfferDocument'
}

export const LOG_FILES = {
  query: gql`
    query getLogs($start: DateTime!, $end: DateTime! ){
      getLogs(start: $start, end: $end){
        uuid
        __typename
        key
        url
        last_modified_at
      }
    }
  `,
  tables: ['private_file'],
  cacheLocation: 'getLogs'
}

const FILE_QUERIES = [
  PRIVATE_FILE,
  DOSSIER_FILE,
  OFFER_FILE,
  LOG_FILES,
]


export default FILE_QUERIES
