import { gql } from '@apollo/client/core';

import { QueryObject } from 'src/apollo/query';
import { TABLES } from 'src/flox/TABLES';

export const GET_PAYMENT: QueryObject = {
  query: gql`
    query Payment($uuid: ID!) {
      Payment(uuid: $uuid) {
        uuid
        description
        amount
        createdAt
        currency
        paid
        buyer {
          uuid
          username
          email
        }
        __typename
      }
    }
  `,
  tables: [TABLES.PAYMENT],
  cacheLocation: 'Payment',
};

export const PAYMENT_QUERIES: QueryObject[] = [GET_PAYMENT];
