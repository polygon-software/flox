import { gql } from '@apollo/client/core';

import { QueryObject } from 'src/apollo/query';
import { TABLES } from 'src/data/TABLES';

const ARTICLE_SUGGESTIONS: QueryObject = {
  query: gql`
    query articleSuggestions($searchTerm: String!) {
      articleSuggestions(searchTerm: $searchTerm) {
        uuid
        articleNumber
        manufacturerNumber
        name
        description
        amount
        __typename
      }
    }
  `,
  cacheLocation: 'articleSuggestions',
  tables: [TABLES.ARTICLE_SUGGESTION],
};

export default ARTICLE_SUGGESTIONS;
