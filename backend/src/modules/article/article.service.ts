import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import xlsx from 'node-xlsx';

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

  /**
   * Updates the articles entities with the data from the given ERP export.
   *
   * @param file - File containg the article list
   */
  createArticleList(file: Buffer): Article[] {
    const parsedFile = xlsx.parse(file);
    parsedFile.forEach((sheet) => {
      console.log(sheet);
    });
    return [new Article()];
  }
}
