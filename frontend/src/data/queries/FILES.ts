import gql from 'graphql-tag';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';

export const ALL_PUBLIC_FILES = {
  query: gql`
    query allPublicFiles($limit: Int, $skip: Int) {
      allPublicFiles(limit: $limit, skip: $skip) {
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
  tables: ['publicFile'],
  cacheLocation: 'allPublicFiles',
}

export const ALL_MY_FILES = {
  query: gql`
    query allMyFiles($limit: Int, $skip: Int) {
      allMyFiles(limit: $limit, skip: $skip) {
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
  tables: ['private_file'],
  cacheLocation: 'allMyFiles',
}

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
  tables: ['publicFile'],
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
  tables: ['private_file'],
  cacheLocation: 'privateFile',
};

export const FILE_QUERIES: QueryObject[] = [GET_PUBLIC_FILE, GET_PRIVATE_FILE, ALL_PUBLIC_FILES, ALL_MY_FILES]
