import gql from 'graphql-tag';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';
import { TABLES } from 'src/flox/TABLES';

export const CREATE_FILE = {
  mutation: gql`
    mutation CreateFile(
      $filename: String!
      $mimetype: String!
      $size: Int!
      $loggedInReadAccess: Boolean
      $publicReadAccess: Boolean
      $readAccess: [ID!]
      $writeAccess: [ID!]
      $expires: Int
    ) {
      CreateFile(
        createFileInput: {
          filename: $filename
          mimetype: $mimetype
          size: $size
          loggedInReadAccess: $loggedInReadAccess
          publicReadAccess: $publicReadAccess
          readAccess: $readAccess
          writeAccess: $writeAccess
          expires: $expires
        }
      ) {
        uuid
        signedUrl
      }
    }
  `,
  tables: [TABLES.FILE],
  type: MutationTypes.CREATE,
  cacheLocation: 'CreateFile',
};

export const UPDATE_FILE = {
  mutation: gql`
    mutation UpdateFile($uuid: ID!, $filename: String, $expires: Int) {
      UpdateFile(
        updateFileInput: { uuid: $uuid, filename: $filename, expires: $expires }
      ) {
        uuid
        createdAt
        mimetype
        filename
        size
        url
      }
    }
  `,
  tables: [TABLES.FILE],
  type: MutationTypes.UPDATE,
  cacheLocation: 'UpdateFile',
};

export const DELETE_FILE = {
  mutation: gql`
    mutation DeleteFile($uuid: ID!) {
      DeleteFile(deleteInput: { uuid: $uuid }) {
        uuid
        createdAt
        mimetype
        filename
        size
        url
      }
    }
  `,
  tables: [TABLES.FILE],
  type: MutationTypes.DELETE,
  cacheLocation: 'DeleteFile',
};

export const FILE_MUTATIONS: MutationObject[] = [
  CREATE_FILE,
  UPDATE_FILE,
  DELETE_FILE,
];
