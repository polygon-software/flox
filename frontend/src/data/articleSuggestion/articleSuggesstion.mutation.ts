import { gql } from '@apollo/client/core';

import { MutationObject, MutationTypes } from 'src/apollo/mutation';
import { TABLES } from 'src/data/TABLES';

const CREATE_ARTICLE_SUGGESTION_LIST: MutationObject = {
  mutation: gql`
    mutation createArticleSuggestionList($uuid: String!) {
      createArticleSuggestionList(uuid: $uuid) {
        amount
        __typename
      }
    }
  `,
  tables: [TABLES.ARTICLE_SUGGESTION],
  type: MutationTypes.CREATE,
  cacheLocation: 'createArticleSuggestionList',
};

export default CREATE_ARTICLE_SUGGESTION_LIST;
