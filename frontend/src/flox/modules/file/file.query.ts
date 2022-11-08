import gql from 'graphql-tag';

import { QueryObject } from 'src/apollo/query';
import { TABLES } from 'src/flox/TABLES';

export const GET_FILE = {
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

export const GET_FILES = {
  query: gql`
    query Files($uuids: [ID!], $expires: Int) {
      Files(uuids: $uuids, expires: $expires) {
        uuid
        path
        createdAt
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

export const GET_MY_FILES = {
  query: gql`
    query MyFiles($uuids: [ID!], $expires: Int) {
      MyFiles(uuids: $uuids, expires: $expires) {
        uuid
        path
        createdAt
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

export const GET_PUBLIC_FILES = {
  query: gql`
    query PublicFiles($uuids: [ID!], $expires: Int) {
      PublicFiles(uuids: $uuids, expires: $expires) {
        uuid
        path
        createdAt
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

export const GET_ALL_FILES = {
  query: gql`
    query AllFiles($skip: Int, $take: Int, $expires: Int, $path: String) {
      AllFiles(skip: $skip, take: $take, expires: $expires, path: $path) {
        uuid
        path
        createdAt
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'AllFiles',
};

export const ALL_MY_FILES = {
  query: gql`
    query AllMyFiles($skip: Int, $take: Int, $expires: Int, $path: String) {
      AllMyFiles(skip: $skip, take: $take, expires: $expires, path: $path) {
        uuid
        path
        createdAt
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'AllMyFiles',
};

export const ALL_PUBLIC_FILES = {
  query: gql`
    query AllPublicFiles($skip: Int, $take: Int, $expires: Int, $path: String) {
      AllPublicFiles(skip: $skip, take: $take, expires: $expires, path: $path) {
        uuid
        path
        createdAt
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'AllPublicFiles',
};

export const SEARCH_FILES = {
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
          mimetype
          filename
          size
          url
        }
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'SearchFiles',
};

export const SEARCH_MY_FILES = {
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
          mimetype
          filename
          size
          url
        }
        __typename
      }
    }
  `,
  tables: [TABLES.FILE],
  cacheLocation: 'SearchMyFiles',
};

export const SEARCH_PUBLIC_FILES = {
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
          mimetype
          filename
          size
          url
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
];
