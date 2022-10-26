import gql from 'graphql-tag';
import { MutationTypes } from 'src/apollo/mutation';
import { TABLES } from 'src/flox/TABLES';

export const CREATE_IMAGE = {
  mutation: gql`
    mutation createImage($file: ID!, $objectRecognition: Boolean) {
      createImage(
        createImageInput: { file: $file, objectRecognition: $objectRecognition }
      ) {
        uuid
        height
        width
        latitude
        longitude
        capturedAt
        file {
          uuid
          url
          __typename
        }
        __typename
      }
    }
  `,
  tables: [TABLES.IMAGE],
  type: MutationTypes.CREATE,
  cacheLocation: 'createImage',
};

export const DELETE_IMAGE = {
  mutation: gql`
    mutation deleteImage($uuid: ID!) {
      deleteImage(deleteImageInput: { uuid: $uuid }) {
        uuid
        file {
          uuid
          url
          __typename
        }
        __typename
      }
    }
  `,
  tables: [TABLES.IMAGE],
  type: MutationTypes.DELETE,
  cacheLocation: 'deleteImage',
};
