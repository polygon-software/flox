import gql from 'graphql-tag';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';


export const GET_IMAGE = {
  query: gql`
    query image($uuid: ID!) {
      image(uuid: $uuid) {
        uuid
        height
        width
        latitude
        longitude
        capturedAt
        file {
          url
        }
        labels {
          name
          confidence
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
  tables: ['image'],
  cacheLocation: 'image',
};

export const GET_IMAGE_FOR_FILE = {
  query: gql`
    query imageForFile($file: ID!) {
      imageForFile(file: $file) {
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
  tables: ['image'],
  cacheLocation: 'imageForFile',
};


export const IMAGE_QUERIES: QueryObject[] = [GET_IMAGE, GET_IMAGE_FOR_FILE];
