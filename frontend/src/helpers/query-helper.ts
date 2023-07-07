import ArticleEntity from 'src/data/article/entities/articleEntity';
import { executeQuery } from 'src/apollo/query';
import ARTICLE_SUGGESTIONS from 'src/data/article/article.query';

/**
 * Executes the query to fetch the article suggestions for the given search term.
 * @param searchTerm - The term to search for
 * @returns The found articles
 */
export default async function articleSuggestions(
  searchTerm: string
): Promise<ArticleEntity> {
  const { data } = await executeQuery<ArticleEntity>(ARTICLE_SUGGESTIONS, {
    searchTerm,
  });
  return data ?? null;
}
