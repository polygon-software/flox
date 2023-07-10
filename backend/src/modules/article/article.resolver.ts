import { Args, Mutation, Resolver } from '@nestjs/graphql';

import DeleteInput from 'src/flox/modules/abstracts/crud/dto/input/delete.input';

import AbstractSearchResolver from '../../flox/modules/abstracts/search/abstract-search.resolver';
import { AdminOnly } from '../../flox/modules/roles/authorization.decorator';

import Article from './entities/article.entity';
import ArticleService from './article.service';

@Resolver(() => Article)
export default class ArticleResolver extends AbstractSearchResolver<
  Article,
  ArticleService
> {
  constructor(private readonly articleService: ArticleService) {
    super(['articleNumber']);
  }

  /**
   * @returns Article service
   */
  get service(): ArticleService {
    return this.articleService;
  }

  /**
   * Deletes an article
   *
   * @param deleteInput - Contains the article's UUID
   * @returns The deleted article
   */
  @AdminOnly()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Mutation(() => Article, { name: 'deleteArticle' })
  async deleteArticle(
    @Args('deleteInput') deleteInput: DeleteInput,
  ): Promise<Article> {
    return super.delete(deleteInput);
  }
}
