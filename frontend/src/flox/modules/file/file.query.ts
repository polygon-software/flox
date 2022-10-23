import gql from 'graphql-tag';
import { QueryObject } from 'src/apollo/query';
import { TABLES } from 'src/flox/TABLES';

export const ALL_PUBLIC_FILES = {
  query: gql`
    query allPublicFiles($take: Int, $skip: Int) {
      allPublicFiles(take: $take, skip: $skip) {
        uuid
        key
        createdAt
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.PUBLIC_FILE],
  cacheLocation: 'allPublicFiles',
};

export const ALL_MY_FILES = {
  query: gql`
    query allMyFiles($take: Int, $skip: Int) {
      allMyFiles(take: $take, skip: $skip) {
        uuid
        key
        createdAt
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.PRIVATE_FILE],
  cacheLocation: 'allMyFiles',
};

export const GET_PUBLIC_FILE = {
  query: gql`
    query publicFile($uuid: ID!) {
      publicFile(uuid: $uuid) {
        uuid
        key
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.PUBLIC_FILE],
  cacheLocation: 'publicFile',
};

export const GET_PRIVATE_FILE = {
  query: gql`
    query privateFile($uuid: ID!, $expires: Int) {
      privateFile(uuid: $uuid, expires: $expires) {
        uuid
        key
        mimetype
        filename
        size
        url
        __typename
      }
    }
  `,
  tables: [TABLES.PRIVATE_FILE],
  cacheLocation: 'privateFile',
};

export const FILE_QUERIES: QueryObject[] = [
  ALL_PUBLIC_FILES,
  ALL_MY_FILES,
  GET_PUBLIC_FILE,
  GET_PRIVATE_FILE,
];
