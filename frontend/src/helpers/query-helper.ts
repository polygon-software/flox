import { executeQuery } from 'src/apollo/query';
import ArticleSuggestionEntity from 'src/data/articleSuggestion/entites/articleSuggestionEntity';
import ARTICLE_SUGGESTIONS from 'src/data/articleSuggestion/articleSuggestion.query';

/**
 * Executes the query to fetch the article suggestions for the given search term.
 * @param searchTerm - The term to search for
 * @returns The found articles
 */
export default async function getArticleSuggestions(
  searchTerm: string
): Promise<ArticleSuggestionEntity[]> {
  const { data } = await executeQuery<ArticleSuggestionEntity[]>(
    ARTICLE_SUGGESTIONS,
    {
      searchTerm,
    }
  );
  return data ?? null;
}
