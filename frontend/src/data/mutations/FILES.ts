import gql from 'graphql-tag';
import {MutationTypes} from '../DATA-DEFINITIONS';
import {TABLES} from 'src/data/TABLES';

export const DELETE_PUBLIC_FILE = {
  mutation: gql`
    mutation deletePublicFile($uuid: ID!) {
      deletePublicFile(deleteFileInput: { uuid: $uuid }) {
        uuid
      }
    }
  `,
  tables: [TABLES.PUBLIC_FILE],
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
  tables: [TABLES.PRIVATE_FILE],
  type: MutationTypes.DELETE,
  cacheLocation: 'deletePrivateFile'
}
