import { gql } from '@apollo/client/core';

import { QueryObject } from 'src/apollo/query';

import { TABLES } from '../../enum/TABLES';

export const GET_FILE: QueryObject = {
  query: gql`
    query File($uuid: ID!, $expires: Int) {
      File(uuid: $uuid, expires: $expires) {
        uuid
        path
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'File',
};

export const GET_FILE_READ_ACCESS_GROUPS: QueryObject = {
  query: gql`
    query FileReadAccessUserGroups($uuid: ID!) {
      FileReadAccessUserGroups(uuid: $uuid) {
        uuid
        name
        users {
          uuid
          username
        }
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'FileReadAccessUserGroups',
};

export const GET_FILE_WRITE_ACCESS_GROUPS: QueryObject = {
  query: gql`
    query FileWriteAccessUserGroups($uuid: ID!) {
      FileWriteAccessUserGroups(uuid: $uuid) {
        uuid
        name
        users {
          uuid
          username
        }
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'FileWriteAccessUserGroups',
};

export const GET_FILES: QueryObject = {
  query: gql`
    query Files($uuids: [ID!], $expires: Int) {
      Files(uuids: $uuids, expires: $expires) {
        uuid
        path
        createdAt
        updatedAt
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'Files',
};

export const GET_MY_FILES: QueryObject = {
  query: gql`
    query MyFiles($uuids: [ID!], $expires: Int) {
      MyFiles(uuids: $uuids, expires: $expires) {
        uuid
        path
        createdAt
        updatedAt
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'MyFiles',
};

export const GET_PUBLIC_FILES: QueryObject = {
  query: gql`
    query PublicFiles($uuids: [ID!], $expires: Int) {
      PublicFiles(uuids: $uuids, expires: $expires) {
        uuid
        path
        createdAt
        updatedAt
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'PublicFiles',
};

export const GET_ALL_FILES: QueryObject = {
  query: gql`
    query AllFiles($skip: Int, $take: Int, $expires: Int, $path: String) {
      AllFiles(skip: $skip, take: $take, expires: $expires, path: $path) {
        uuid
        path
        createdAt
        updatedAt
        mimetype
        filename
        size
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'AllFiles',
};

export const GET_ALL_FOLDERS: QueryObject = {
  query: gql`
    query Folders($path: String!) {
      Folders(path: $path) {
        uuid
        name
        files
        size
        createdAt
        updatedAt
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'Folders',
};

export const ALL_MY_FILES: QueryObject = {
  query: gql`
    query AllMyFiles($skip: Int, $take: Int, $expires: Int, $path: String) {
      AllMyFiles(skip: $skip, take: $take, expires: $expires, path: $path) {
        uuid
        path
        createdAt
        updatedAt
        mimetype
        filename
        size
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'AllMyFiles',
};

export const GET_MY_FOLDERS: QueryObject = {
  query: gql`
    query MyFolders($path: String!) {
      MyFolders(path: $path) {
        uuid
        name
        files
        size
        createdAt
        updatedAt
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'MyFolders',
};

export const ALL_PUBLIC_FILES: QueryObject = {
  query: gql`
    query AllPublicFiles($skip: Int, $take: Int, $expires: Int, $path: String) {
      AllPublicFiles(skip: $skip, take: $take, expires: $expires, path: $path) {
        uuid
        path
        createdAt
        updatedAt
        mimetype
        filename
        size
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'AllPublicFiles',
};

export const GET_PUBLIC_FOLDERS: QueryObject = {
  query: gql`
    query PublicFolders($path: String!) {
      PublicFolders(path: $path) {
        uuid
        name
        files
        size
        createdAt
        updatedAt
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'PublicFolders',
};

export const SEARCH_FILES: QueryObject = {
  query: gql`
    query SearchFiles(
      $take: Int
      $skip: Int
      $filter: String
      $sortBy: String
      $descending: Boolean
      $expires: Int
    ) {
      SearchFiles(
        take: $take
        skip: $skip
        filter: $filter
        sortBy: $sortBy
        descending: $descending
        expires: $expires
      ) {
        count
        data {
          uuid
          path
          createdAt
          updatedAt
          mimetype
          filename
          size
        }
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'SearchFiles',
};

export const SEARCH_MY_FILES: QueryObject = {
  query: gql`
    query SearchMyFiles(
      $take: Int
      $skip: Int
      $filter: String
      $sortBy: String
      $descending: Boolean
      $expires: Int
    ) {
      SearchMyFiles(
        take: $take
        skip: $skip
        filter: $filter
        sortBy: $sortBy
        descending: $descending
        expires: $expires
      ) {
        count
        data {
          uuid
          path
          createdAt
          updatedAt
          mimetype
          filename
          size
        }
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'SearchMyFiles',
};

export const SEARCH_PUBLIC_FILES: QueryObject = {
  query: gql`
    query SearchPublicFiles(
      $take: Int
      $skip: Int
      $filter: String
      $sortBy: String
      $descending: Boolean
      $expires: Int
    ) {
      SearchPublicFiles(
        take: $take
        skip: $skip
        filter: $filter
        sortBy: $sortBy
        descending: $descending
        expires: $expires
      ) {
        count
        data {
          uuid
          path
          createdAt
          updatedAt
          mimetype
          filename
          size
        }
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'SearchPublicFiles',
};

export const FILE_QUERIES: QueryObject[] = [
  GET_FILE,
  GET_FILES,
  GET_MY_FILES,
  GET_PUBLIC_FILES,
  GET_ALL_FILES,
  SEARCH_FILES,
  SEARCH_MY_FILES,
  SEARCH_PUBLIC_FILES,
  GET_ALL_FOLDERS,
  GET_MY_FOLDERS,
  GET_PUBLIC_FOLDERS,
  GET_FILE_READ_ACCESS_GROUPS,
  GET_FILE_WRITE_ACCESS_GROUPS,
];
