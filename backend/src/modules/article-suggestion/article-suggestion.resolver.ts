import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AdminOnly } from '../../flox/modules/roles/authorization.decorator';
import AbstractSearchResolver from '../../flox/modules/abstracts/search/abstract-search.resolver';
import FileService from '../../flox/modules/file/file.service';

import ArticleSuggstionService from './article-suggstion.service';
import CreateArticleSuggesstionOutput from './dto/output/create-article-suggesstion.output';
import ArticleSuggestion from './entities/article-suggestion.entity';

@Resolver(() => ArticleSuggestion)
export default class ArticleSuggestionResolver extends AbstractSearchResolver<
  ArticleSuggestion,
  ArticleSuggstionService
> {
  constructor(
    private readonly articleSuggestionService: ArticleSuggstionService,
    private readonly fileService: FileService,
  ) {
    super(['articleNumber']);
  }

  /**
   * @returns Article service
   */
  get service(): ArticleSuggstionService {
    return this.articleSuggestionService;
  }

  /**
   * Updates the article suggestion list based on the ERP Excel export.
   *
   * @param uuid - The file as a base64 string
   * @returns The number of created articles suggestions
   */
  @AdminOnly()
  @Mutation(() => CreateArticleSuggesstionOutput, { name: 'createArticleList' })
  async createArticleList(
    @Args('uuid') uuid: string,
  ): Promise<CreateArticleSuggesstionOutput> {
    const fileBuffer = await this.fileService.getS3File(uuid);
    return this.articleSuggestionService.createArticleSuggestionList(
      fileBuffer,
    );
  }

  /**
   * Returns all article suggestions that match the given search term.
   * Only returns the result if there are 50 or fewer results.
   *
   * @param searchTerm - The search term
   * @returns The article suggestions
   */
  @AdminOnly()
  @Query(() => [ArticleSuggestion], { name: 'articleSuggestions' })
  async articleSuggestions(
    @Args('searchTerm') searchTerm: string,
  ): Promise<ArticleSuggestion[]> {
    return this.articleSuggestionService.articleSuggestions(searchTerm);
  }
}
