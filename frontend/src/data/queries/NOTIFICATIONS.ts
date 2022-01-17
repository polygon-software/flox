import gql from 'graphql-tag';
import {MutationTypes, QueryObject} from 'src/data/DATA-DEFINITIONS';

/**
 * Notification-related queries
 */

export const UPDATE_NOTIFICATION = {
  mutation: gql`
    mutation updateNotification($updateNotificationInput: UpdateNotificationInput!){
      updateNotification (updateNotificationInput: $updateNotificationInput) {
        uuid
        isRead
        __typename
      }
    }`,
  tables: ['notification'],
  type: MutationTypes.UPDATE,
  cacheLocation: 'updateNotification'
}

export const NOTIFICATION_QUERIES: QueryObject[] = []
