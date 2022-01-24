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

const FILE_QUERIES = [
  PRIVATE_FILE,
  DOSSIER_FILE,
  OFFER_FILE
]


export default FILE_QUERIES
