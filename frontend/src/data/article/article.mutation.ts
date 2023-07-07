import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';
import { TABLES } from 'src/data/TABLES';

const CREATE_ARTICLE_LIST: MutationObject = {
  mutation: gql`
    mutation createArticleList($uuid: String!) {
      createArticleList(uuid: $uuid) {
        amount
      }
    }
  `,
  tables: [TABLES.ARTICLE],
  type: MutationTypes.CREATE,
  cacheLocation: 'createArticleList',
};

export default CREATE_ARTICLE_LIST;
