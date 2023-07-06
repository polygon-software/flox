import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';
import { TABLES } from 'src/data/TABLES';

const CREATE_ARTICLE_LIST: MutationObject = {
  mutation: gql`
    mutation createArticleList($uuid: String!) {
      createArticleList(uuid: $uuid) {
        uuid
        articleNumber
        manufacturerNumber
        amount
        discount
      }
    }
  `,
  tables: [TABLES.ARTICLE],
  type: MutationTypes.CREATE,
  cacheLocation: 'CreateArticleList',
};

export default CREATE_ARTICLE_LIST;
