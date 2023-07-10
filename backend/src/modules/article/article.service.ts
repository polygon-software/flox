import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import AbstractSearchService from '../../flox/modules/abstracts/search/abstract-search.service';

import Article from './entities/article.entity';

@Injectable()
export default class ArticleService extends AbstractSearchService<Article> {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {
    super();
  }

  /**
   * @returns Article repository
   */
  get repository(): Repository<Article> {
    return this.articleRepository;
  }
}
