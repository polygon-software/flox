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

const FILE_QUERIES = [
  PRIVATE_FILE,
]

export default FILE_QUERIES
