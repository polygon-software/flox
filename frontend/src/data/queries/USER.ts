import gql from 'graphql-tag';
import { QueryObject } from 'src/data/DATA-DEFINITIONS';

/**
 * User-related queries
 */

export const MY_USER = {
  query: gql`
    query {
      myUser {
        uuid
        role
        name
        __typename
      }
    }
  `,
  tables: ['user'],
  cacheLocation: 'myUser',
};

export const USER_QUERIES: QueryObject[] = [MY_USER];
