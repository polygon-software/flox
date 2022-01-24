import gql from 'graphql-tag';
import { MutationTypes } from 'src/data/DATA-DEFINITIONS';

export const UPDATE_NOTIFICATION = {
  mutation: gql`
    mutation updateNotification(
      $updateNotificationInput: UpdateNotificationInput!
    ) {
      updateNotification(updateNotificationInput: $updateNotificationInput) {
        uuid
        isRead
        __typename
      }
    }
  `,
  tables: ['notification'],
  type: MutationTypes.UPDATE,
  cacheLocation: 'updateNotification',
};
