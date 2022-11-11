import { gql } from 'graphql-tag';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';
import { TABLES } from 'src/flox/TABLES';

export const MARK_NOTIFICATION_AS_READ: MutationObject = {
  mutation: gql`
    mutation MarkNotificationAsRead($uuid: ID!) {
      MarkNotificationAsRead(markAsReadInput: { uuid: $uuid }) {
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
      }
    }
  `,
  tables: [TABLES.NOTIFICATIONS],
  type: MutationTypes.UPDATE,
  cacheLocation: 'MarkNotificationAsRead',
};

export const NOTIFY_USERS: MutationObject = {
  mutation: gql`
    mutation NotifyUsers(
      $receivers: [ID!]!
      $deContent: String!
      $deTitle: String!
      $enContent: String!
      $enTitle: String!
      $link: String
    ) {
      NotifyUsers(
        notifyUsersInput: {
          receivers: $receivers
          deContent: $deContent
          deTitle: $deTitle
          enContent: $enContent
          enTitle: $enTitle
          link: $link
        }
      ) {
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
      }
    }
  `,
  tables: [TABLES.NOTIFICATIONS],
  type: MutationTypes.UPDATE,
  cacheLocation: 'NotifyUsers',
};

export const NOTIFY_ALL_USERS: MutationObject = {
  mutation: gql`
    mutation NotifyAllUsers(
      $deContent: String!
      $deTitle: String!
      $enContent: String!
      $enTitle: String!
      $link: String
    ) {
      NotifyAllUsers(
        notifyInput: {
          deContent: $deContent
          deTitle: $deTitle
          enContent: $enContent
          enTitle: $enTitle
          link: $link
        }
      ) {
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
      }
    }
  `,
  tables: [TABLES.NOTIFICATIONS],
  type: MutationTypes.UPDATE,
  cacheLocation: 'NotifyAllUsers',
};
