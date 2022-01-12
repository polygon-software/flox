import gql from 'graphql-tag';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';

/**
 * Notification-related queries
 */

export const ALL_NOTIFICATIONS = {
  query: gql`
    query{
      allNotifications{
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
  cacheLocation: 'allNotifications'
}

export const MY_NOTIFICATIONS = {
  query: gql`
    query{
      myUser{
        notifications {
          uuid
          title
          received
          content
          isRead
        }
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'myNotifications'
}

export const NOTIFICATION = {
  query: gql`
    query notification($uuid: ID!){
      notification(uuid: $uuid){
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
  cacheLocation: 'notification'
}

export const NOTIFICATION_QUERIES: QueryObject[] = [ALL_NOTIFICATIONS, MY_NOTIFICATIONS, NOTIFICATION]
