import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';

import { TABLES } from '../../enum/TABLES';

export const CREATE_IMAGE: MutationObject = {
  mutation: gql`
    mutation CreateImage($file: ID!, $objectRecognition: Boolean) {
      CreateImage(
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
  cacheLocation: 'CreateImage',
};

export const DELETE_IMAGE: MutationObject = {
  mutation: gql`
    mutation DeleteImage($uuid: ID!) {
      DeleteImage(deleteImageInput: { uuid: $uuid }) {
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
  cacheLocation: 'DeleteImage',
};
