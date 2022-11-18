import { gql } from '@apollo/client/core';

import { QueryObject } from 'src/apollo/query';

import { TABLES } from '../../enum/TABLES';

export const GET_UNREAD_NOTIFICATIONS: QueryObject = {
  query: gql`
    query UnreadNotifications {
      UnreadNotifications {
        createdAt
        uuid
        messages {
          title
          content
          lang
          link
        }
        __typename
      }
    }
  `,
  tables: [TABLES.NOTIFICATION],
  cacheLocation: 'UnreadNotifications',
};

export const NOTIFICATION_QUERIES: QueryObject[] = [GET_UNREAD_NOTIFICATIONS];
