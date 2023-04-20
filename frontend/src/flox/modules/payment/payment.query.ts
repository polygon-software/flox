import { gql } from '@apollo/client/core';

import { QueryObject } from 'src/apollo/query';

import { TABLES } from '../../enum/TABLES';

export const GET_PAYMENT: QueryObject = {
  query: gql`
    query Payment($uuid: ID!) {
      Payment(uuid: $uuid) {
        uuid
        description
        amount
        createdAt
        currency
        status
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

export const SEARCH_PAYMENT: QueryObject = {
  query: gql`
    query SearchPayments(
      $take: Int
      $skip: Int
      $filter: String
      $sortBy: String
      $descending: Boolean
    ) {
      SearchPayments(
        take: $take
        skip: $skip
        filter: $filter
        sortBy: $sortBy
        descending: $descending
      ) {
        count
        data {
          uuid
          description
          amount
          createdAt
          currency
          status
          paid
          buyer {
            uuid
            username
            email
          }
        }
        __typename
      }
    }
  `,
  tables: [TABLES.PAYMENT],
  cacheLocation: 'SearchPayments',
};

export const PAYMENT_QUERIES: QueryObject[] = [GET_PAYMENT, SEARCH_PAYMENT];
