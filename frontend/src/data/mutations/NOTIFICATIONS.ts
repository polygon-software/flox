import gql from 'graphql-tag';
import { MutationTypes } from 'src/data/DATA-DEFINITIONS';

export const MARK_NOTIFICATION_AS_READ = {
  mutation: gql`
    mutation markNotificationAsRead($uuid: String!) {
      markNotificationAsRead(uuid: $uuid) {
        uuid
        isRead
        __typename
      }
    }
  `,
  tables: ['notification'],
  type: MutationTypes.UPDATE,
  cacheLocation: 'markNotificationAsRead',
};
