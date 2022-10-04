import gql from 'graphql-tag';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';

export const GET_ALL_PUBLIC_FILES = {
  query: gql`
    query getAllPublicFiles($limit: Int, $skip: Int) {
      getAllPublicFiles(limit: $limit, skip: $skip) {
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
  tables: ['public_file'],
  cacheLocation: 'public_file',
}

export const GET_ALL_MY_FILES = {
  query: gql`
    query getAllMyFiles($limit: Int, $skip: Int) {
      getAllMyFiles(limit: $limit, skip: $skip) {
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
  cacheLocation: 'private_file',
}

export const GET_PUBLIC_FILE = {
  query: gql`
    query getPublicFile($uuid: ID!) {
      getPublicFile(uuid: $uuid) {
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
  tables: ['public_file'],
  cacheLocation: 'public_file',
};

export const GET_PRIVATE_FILE = {
  query: gql`
    query getPrivateFile($uuid: ID!, $expires: Int) {
      getPrivateFile(uuid: $uuid, expires: $expires) {
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
  cacheLocation: 'private_file',
};

export const FILE_QUERIES: QueryObject[] = [GET_PUBLIC_FILE, GET_PRIVATE_FILE, GET_ALL_PUBLIC_FILES, GET_ALL_MY_FILES]
