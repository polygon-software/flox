import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { USER_ROLE } from 'src/ENUM/enum';

import { Roles } from '../../flox/modules/roles/authorization.decorator';
import AbstractSearchResolver from '../../flox/modules/abstracts/search/abstract-search.resolver';
import FileService from '../../flox/modules/file/file.service';

import Article from './entities/article.entity';
import ArticleService from './article.service';
import CreateArticlesOutput from './dto/output/create-articles.output';

@Resolver(() => Article)
export default class ArticleResolver extends AbstractSearchResolver<
  Article,
  ArticleService
> {
  constructor(
    private readonly articleService: ArticleService,
    private readonly fileService: FileService,
  ) {
    super(['articleNumber']);
  }

  /**
   * @returns Article service
   */
  get service(): ArticleService {
    return this.articleService;
  }

  /**
   * Updates the article list based on the ERP Excel export.
   *
   * @param uuid - The file as a base64 string
   * @returns The number of created articles
   */
  @Roles(USER_ROLE.ADMIN)
  @Mutation(() => CreateArticlesOutput, { name: 'createArticleList' })
  async createArticleList(
    @Args('uuid') uuid: string,
  ): Promise<CreateArticlesOutput> {
    const fileBuffer = await this.fileService.getS3File(uuid);
    return this.articleService.createArticleList(fileBuffer);
  }
}
