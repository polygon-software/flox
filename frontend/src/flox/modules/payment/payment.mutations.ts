import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';

import { TABLES } from '../../enum/TABLES';

// eslint-disable-next-line import/prefer-default-export
export const TEST_PAYMENT: MutationObject = {
  mutation: gql`
    mutation TestPayment {
      TestPayment {
        uuid
        description
        secret
        amount
        currency
      }
    }
  `,
  tables: [TABLES.PAYMENT],
  type: MutationTypes.UPDATE,
  cacheLocation: 'TestPayment',
};
