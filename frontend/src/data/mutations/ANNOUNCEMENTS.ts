import gql from 'graphql-tag';
import { MutationTypes } from 'src/data/DATA-DEFINITIONS';

export const CREATE_ANNOUNCEMENT = {
  mutation: gql`
    mutation createAnnouncement(
      $createAnnouncementInput: CreateAnnouncementInput!
    ) {
      createAnnouncement(createAnnouncementInput: $createAnnouncementInput) {
        uuid
        title
        content
        date
        userRole
        scheduled
        __typename
      }
    }
  `,
  tables: ['announcement'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createAnnouncement',
};

export const UPDATE_ANNOUNCEMENT = {
  mutation: gql`
    mutation updateAnnouncement(
      $updateAnnouncementInput: UpdateAnnouncementInput!
    ) {
      updateAnnouncement(updateAnnouncementInput: $updateAnnouncementInput) {
        uuid
        title
        content
        date
        userRole
        scheduled
        __typename
      }
    }
  `,
  tables: ['announcement'],
  type: MutationTypes.UPDATE,
  cacheLocation: 'updateAnnouncement',
};

export const DELETE_ANNOUNCEMENT = {
  mutation: gql`
    mutation deleteAnnouncement(
      $deleteAnnouncementInput: DeleteAnnouncementInput!
    ) {
      deleteAnnouncement(deleteAnnouncementInput: $deleteAnnouncementInput) {
        uuid
        title
        content
        date
        userRole
        scheduled
        __typename
      }
    }
  `,
  tables: ['announcement'],
  type: MutationTypes.DELETE,
  cacheLocation: 'deleteAnnouncement',
};
