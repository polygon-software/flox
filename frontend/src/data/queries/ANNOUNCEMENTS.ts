import gql from 'graphql-tag';
import { QueryObject } from 'src/data/DATA-DEFINITIONS';

/**
 * Announcement-related queries
 */
export const ALL_ANNOUNCEMENTS = {
  query: gql`
    query {
      allAnnouncements {
        uuid
        title
        date
        content
        userRole
        scheduled
        __typename
      }
    }
  `,
  tables: ['announcement'],
  cacheLocation: 'allAnnouncements',
};

export const ANNOUNCEMENT = {
  query: gql`
    query announcement($uuid: ID!) {
      announcement(uuid: $uuid) {
        uuid
        title
        date
        content
        userRole
        scheduled
        __typename
      }
    }
  `,
  tables: ['announcement'],
  cacheLocation: 'announcement',
};

export const ANNOUNCEMENT_QUERIES: QueryObject[] = [
  ALL_ANNOUNCEMENTS,
  ANNOUNCEMENT,
];
