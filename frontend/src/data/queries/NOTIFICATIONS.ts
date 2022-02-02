import gql from 'graphql-tag';
import { QueryObject } from 'src/data/DATA-DEFINITIONS';

/**
 * Notification-related queries
 */

export const MY_NOTIFICATIONS = {
  query: gql`
    query {
      myNotifications {
        uuid
        title
        received
        content
        isRead
        __typename
      }
    }
  `,
  tables: ['notification'],
  cacheLocation: 'myNotifications',
};

export const NOTIFICATION_QUERIES: QueryObject[] = [MY_NOTIFICATIONS];
