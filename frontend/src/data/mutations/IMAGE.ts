import gql from 'graphql-tag';
import {MutationTypes} from 'src/data/DATA-DEFINITIONS';

export const CREATE_IMAGE = {
  mutation: gql`
        mutation createImage($file: ID!){
            createImage (createImageInput: {file: $file}) {
              uuid
              file {
                url
              }
              __typename
            }
        }`,
  tables: ['image'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createImage'
}

export const DELETE_IMAGE = {
  mutation: gql`
        mutation deleteImage($uuid: ID!){
            deleteImage (deleteImageInput: {uuid: $uuid}) {
              uuid
              file {
                url
              }
              __typename
            }
        }`,
  tables: ['image'],
  type: MutationTypes.DELETE,
  cacheLocation: 'deleteImage'
}
