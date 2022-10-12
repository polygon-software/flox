import { gql } from '@apollo/client/core';

import { QueryObject } from 'src/apollo/query';

import { TABLES } from '../../enum/TABLES';

export const GET_IMAGE: QueryObject = {
  query: gql`
    query Image($uuid: ID!, $expires: Int) {
      Image(uuid: $uuid, expires: $expires) {
        uuid
        height
        width
        latitude
        longitude
        capturedAt
        file {
          filename
          path
          url
        }
        labels {
          uuid
          name
          confidence
          parents
          boundingBox {
            width
            height
            top
            left
          }
        }
        __typename
      }
    }
  `,
  tables: [TABLES.IMAGE, TABLES.LABEL, TABLES.BOUNDING_BOX],
  cacheLocation: 'Image',
};

export const GET_IMAGES: QueryObject = {
  query: gql`
    query Images($uuids: [ID!], $expires: Int) {
      Images(uuids: $uuids, expires: $expires) {
        uuid
        height
        width
        latitude
        longitude
        capturedAt
        file {
          filename
          path
          url
        }
        labels {
          uuid
          name
          confidence
          parents
          boundingBox {
            width
            height
            top
            left
          }
        }
        __typename
      }
    }
  `,
  tables: [TABLES.IMAGE, TABLES.LABEL, TABLES.BOUNDING_BOX],
  cacheLocation: 'Images',
};

export const GET_MY_IMAGES: QueryObject = {
  query: gql`
    query MyImages($uuids: [ID!], $expires: Int) {
      MyImages(uuids: $uuids, expires: $expires) {
        uuid
        height
        width
        latitude
        longitude
        capturedAt
        file {
          filename
          path
          url
        }
        labels {
          uuid
          name
          confidence
          parents
          boundingBox {
            width
            height
            top
            left
          }
        }
        __typename
      }
    }
  `,
  tables: [TABLES.IMAGE, TABLES.LABEL, TABLES.BOUNDING_BOX],
  cacheLocation: 'MyImages',
};

export const GET_ALL_IMAGES: QueryObject = {
  query: gql`
    query AllImages($skip: Int, $take: Int, $expires: Int) {
      AllImages(skip: $skip, take: $take, expires: $expires) {
        uuid
        height
        width
        latitude
        longitude
        capturedAt
        file {
          filename
          path
          url
        }
        labels {
          uuid
          name
          confidence
          parents
          boundingBox {
            width
            height
            top
            left
          }
        }
        __typename
      }
    }
  `,
  tables: [TABLES.IMAGE, TABLES.LABEL, TABLES.BOUNDING_BOX],
  cacheLocation: 'AllImages',
};

export const GET_ALL_MY_IMAGES: QueryObject = {
  query: gql`
    query AllMyImages($skip: Int, $take: Int, $expires: Int) {
      AllMyImages(skip: $skip, take: $take, expires: $expires) {
        uuid
        height
        width
        latitude
        longitude
        capturedAt
        file {
          filename
          path
          url
        }
        labels {
          uuid
          name
          confidence
          parents
          boundingBox {
            width
            height
            top
            left
          }
        }
        __typename
      }
    }
  `,
  tables: [TABLES.IMAGE, TABLES.LABEL, TABLES.BOUNDING_BOX],
  cacheLocation: 'AllMyImages',
};

export const GET_IMAGE_FOR_FILE: QueryObject = {
  query: gql`
    query ImageForFile($file: ID!, $expires: Int) {
      ImageForFile(file: $file, expires: $expires) {
        uuid
        height
        width
        latitude
        longitude
        capturedAt
        file {
          url
        }
        __typename
      }
    }
  `,
  tables: [TABLES.IMAGE, TABLES.LABEL, TABLES.BOUNDING_BOX],
  cacheLocation: 'ImageForFile',
};

export const SEARCH_IMAGES: QueryObject = {
  query: gql`
    query SearchImages(
      $take: Int
      $skip: Int
      $filter: String
      $sortBy: String
      $descending: Boolean
      $expires: Int
    ) {
      SearchImages(
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
          height
          width
          latitude
          longitude
          capturedAt
          file {
            url
          }
        }
        __typename
      }
    }
  `,
  tables: [TABLES.IMAGE, TABLES.LABEL, TABLES.BOUNDING_BOX],
  cacheLocation: 'SearchImages',
};

export const SEARCH_MY_IMAGES: QueryObject = {
  query: gql`
    query SearchMyImages(
      $take: Int
      $skip: Int
      $filter: String
      $sortBy: String
      $descending: Boolean
      $expires: Int
    ) {
      SearchMyImages(
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
          height
          width
          latitude
          longitude
          capturedAt
          file {
            url
          }
        }
        __typename
      }
    }
  `,
  tables: [TABLES.IMAGE, TABLES.LABEL, TABLES.BOUNDING_BOX],
  cacheLocation: 'SearchMyImages',
};

export const IMAGE_QUERIES: QueryObject[] = [
  GET_IMAGE,
  GET_IMAGES,
  GET_MY_IMAGES,
  GET_ALL_IMAGES,
  GET_ALL_MY_IMAGES,
  GET_IMAGE_FOR_FILE,
  SEARCH_IMAGES,
  SEARCH_MY_IMAGES,
];
