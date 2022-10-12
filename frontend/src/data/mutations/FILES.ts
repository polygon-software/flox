import gql from 'graphql-tag';
import {MutationTypes} from '../DATA-DEFINITIONS';

export const DELETE_PUBLIC_FILE = {
  mutation: gql`
    mutation deletePublicFile($uuid: ID!) {
      deletePublicFile(deleteFileInput: { uuid: $uuid }) {
        uuid
      }
    }
  `,
  tables: ['publicFile'],
  type: MutationTypes.DELETE,
  cacheLocation: 'deletePublicFile'
}

export const DELETE_PRIVATE_FILE = {
  mutation: gql`
    mutation deletePrivateFile($uuid: ID!) {
      deletePrivateFile(deleteFileInput: { uuid: $uuid }) {
        uuid
      }
    }
  `,
  tables: ['privateFile'],
  type: MutationTypes.DELETE,
  cacheLocation: 'deletePrivateFile'
}
