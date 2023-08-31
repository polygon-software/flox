import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';

import { TABLES } from '../../enum/TABLES';

export const MARK_NOTIFICATION_AS_READ: MutationObject = {
  mutation: gql`
    mutation MarkNotificationAsRead($uuid: ID!) {
      MarkNotificationAsRead(markAsReadInput: { uuid: $uuid }) {
        uuid
      }
    }
  `,
  tables: [TABLES.NOTIFICATION],
  type: MutationTypes.UPDATE,
  cacheLocation: 'MarkNotificationAsRead',
};

export const NOTIFY_USERS: MutationObject = {
  mutation: gql`
    mutation NotifyUsers($recipients: [ID!]!, $messages: [MessageInput!]!) {
      NotifyUsers(
        notifyUsersInput: { recipients: $recipients, messages: $messages }
      ) {
        uuid
        createdAt
      }
    }
  `,
  tables: [TABLES.NOTIFICATION],
  type: MutationTypes.UPDATE,
  cacheLocation: 'NotifyUsers',
};

export const NOTIFY_ALL_USERS: MutationObject = {
  mutation: gql`
    mutation NotifyAllUsers($messages: [MessageInput!]!) {
      NotifyAllUsers(notifyInput: { messages: $messages }) {
        uuid
        createdAt
      }
    }
  `,
  tables: [TABLES.NOTIFICATION],
  type: MutationTypes.UPDATE,
  cacheLocation: 'NotifyAllUsers',
};
