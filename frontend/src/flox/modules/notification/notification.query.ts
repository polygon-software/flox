import { gql } from 'graphql-tag';

import { QueryObject } from 'src/apollo/query';
import { TABLES } from 'src/flox/TABLES';

export const GET_UNREAD_NOTIFICATIONS: QueryObject = {
  query: gql`
    query UnreadNotifications {
      UnreadNotifications {
        createdAt
        uuid
        link
        deTitle
        deContent
        enTitle
        enContent
        receiver {
          uuid
          username
        }
        __typename
      }
    }
  `,
  tables: [TABLES.NOTIFICATIONS],
  cacheLocation: 'UnreadNotifications',
};

export const NOTIFICATION_QUERIES: QueryObject[] = [GET_UNREAD_NOTIFICATIONS];
