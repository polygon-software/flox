import gql from 'graphql-tag';
import {MutationTypes, QueryObject} from 'src/data/DATA-DEFINITIONS';

/**
 * Announcement-related queries
 */

export const CREATE_ANNOUNCEMENT = {
  mutation: gql`
    mutation createAnnouncement($createAnnouncementInput: CreateAnnouncementInput!){
      createAnnouncement (createAnnouncementInput: $createAnnouncementInput) {
        uuid
        title
        content
        date
        userRole
        __typename
      }
    }`,
  tables: ['announcement'],
  type: MutationTypes.CREATE,
  cacheLocation: 'createAnnouncement'
}

export const UPDATE_ANNOUNCEMENT = {
  mutation: gql`
    mutation updateAnnouncement($updateAnnouncementInput: UpdateAnnouncementInput!){
      updateAnnouncement (updateAnnouncementInput: $updateAnnouncementInput) {
        uuid
        title
        content
        date
        userRole
        __typename
      }
    }`,
  tables: ['announcement'],
  type: MutationTypes.UPDATE,
  cacheLocation: 'updateAnnouncement'
}

export const DELETE_ANNOUNCEMENT = {
  mutation: gql`
    mutation deleteAnnouncement($deleteAnnouncementInput: DeleteAnnouncementInput!){
      deleteAnnouncement (deleteAnnouncementInput: $deleteAnnouncementInput) {
        uuid
        title
        content
        date
        userRole
        __typename
      }
    }`,
  tables: ['announcement'],
  type: MutationTypes.DELETE,
  cacheLocation: 'deleteAnnouncement'
}

export const ALL_ANNOUNCEMENTS = {
  query: gql`
    query{
      allAnnouncements{
        uuid
        title
        date
        content
        userRole
        __typename
      }
    }
  `,
  tables: ['announcement'],
  cacheLocation: 'allAnnouncements'
}



export const ANNOUNCEMENT = {
  query: gql`
    query announcement($uuid: ID!){
      announcement(uuid: $uuid){
        uuid
        title
        date
        content
        userRole
        __typename
      }
    }
  `,
  tables: ['announcement'],
  cacheLocation: 'announcement'
}

export const ANNOUNCEMENT_QUERIES: QueryObject[] = [ALL_ANNOUNCEMENTS, ANNOUNCEMENT]
