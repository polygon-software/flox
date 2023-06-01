import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';

import { TABLES } from '../../enum/TABLES';

export const CREATE_FILE: MutationObject = {
  mutation: gql`
    mutation CreateImageFile(
      $filename: String!
      $mimetype: String!
      $size: Int!
      $loggedInReadAccess: Boolean
      $publicReadAccess: Boolean
      $readAccess: [ID!]
      $writeAccess: [ID!]
      $path: String!
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
          path: $path
        }
      ) {
        uuid
        path
        createdAt
        mimetype
        filename
        size
        url
        signedUrl
      }
    }
  `,
  tables: [TABLES.FILE],
  type: MutationTypes.CREATE,
  cacheLocation: 'CreateFile',
};

export const UPDATE_FILE: MutationObject = {
  mutation: gql`
    mutation UpdateFile($uuid: ID!, $filename: String, $path: String!) {
      UpdateFile(
        updateFileInput: { uuid: $uuid, filename: $filename, path: $path }
      ) {
        uuid
        path
        createdAt
        mimetype
        filename
        size
        url
      }
    }
  `,
  tables: [TABLES.FILE, TABLES.IMAGE],
  type: MutationTypes.UPDATE,
  cacheLocation: 'UpdateFile',
};

export const DELETE_FILE: MutationObject = {
  mutation: gql`
    mutation DeleteFile($uuid: ID!) {
      DeleteFile(deleteInput: { uuid: $uuid }) {
        uuid
        path
        createdAt
        mimetype
        filename
        size
        url
      }
    }
  `,
  tables: [TABLES.FILE, TABLES.IMAGE],
  type: MutationTypes.DELETE,
  cacheLocation: 'DeleteFile',
};

export const MANIPULATE_FILE_ACCESS_USER_GROUPS: MutationObject = {
  mutation: gql`
    mutation ManipulateFileAccessUserGroups(
      $addReadAccess: [ID!]
      $addWriteAccess: [ID!]
      $removeReadAccess: [ID!]
      $removeWriteAccess: [ID!]
      $uuid: ID!
    ) {
      ManipulateFileAccessUserGroups(
        manipulateAccessGroups: {
          uuid: $uuid
          addReadAccess: $addReadAccess
          addWriteAccess: $addWriteAccess
          removeReadAccess: $removeReadAccess
          removeWriteAccess: $removeWriteAccess
        }
      ) {
        uuid
      }
    }
  `,
  tables: [TABLES.FILE, TABLES.IMAGE],
  type: MutationTypes.DEVALIDATINGUPDATE,
  cacheLocation: 'ManipulateFileAccessUserGroups',
};

export const FILE_MUTATIONS: MutationObject[] = [
  CREATE_FILE,
  UPDATE_FILE,
  DELETE_FILE,
  MANIPULATE_FILE_ACCESS_USER_GROUPS,
];
