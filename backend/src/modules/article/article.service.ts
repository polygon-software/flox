import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import xlsx from 'node-xlsx';

import AbstractSearchService from '../../flox/modules/abstracts/search/abstract-search.service';

import Article from './entities/article.entity';
import CreateArticlesOutput from './dto/output/create-articles.output';

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
   * @returns The number of created articles
   */
  async createArticleList(file: Buffer): Promise<CreateArticlesOutput> {
    const parsedFile = xlsx.parse(file);
    const sheet = parsedFile[0].data;

    // Delete the header row
    const reducedSheet = sheet.slice(1);

    // Create new articles
    const newArticles = reducedSheet.map((entry) => {
      return {
        articleNumber: entry[0] as string,
        manufacturerNumber: (entry[1] as string) ?? null,
        price: this.extractPrice(entry[2] as string),
        name: (entry[3] as string) ?? null,
        description: (entry[4] as string) ?? null,
        amount: 1,
      } as Article;
    });

    // Get the existing articles and delete them
    const articles = await this.repository.find();
    if (articles.length > 0) {
      await this.repository.delete(articles.map((article) => article.uuid));
    }

    // Save the new articles
    const promiseArray: Promise<Article>[] = [];
    newArticles.forEach((article) => {
      promiseArray.push(super.create(article));
    });
    await Promise.all(promiseArray);
    return { amount: promiseArray.length } as CreateArticlesOutput;
  }

  /**
   * Returns all articles, for which the article nubmer starts with the given
   * search term.
   *
   * @param searchTerm - The term to search for
   * @returns The found articles
   */
  async articleSuggestions(searchTerm: string): Promise<Article[]> {
    return this.repository
      .createQueryBuilder('article')
      .where('LOWER(article.articleNumber) LIKE LOWER(:searchTerm)', {
        searchTerm: `${searchTerm}%`,
      })
      .getMany();
  }

  /**
   * Helper function to extract the price from the ERP export.
   *
   * @param price - The price cell
   * @returns The price as a number or null
   */
  extractPrice(price: string | null): number | null {
    if (!price) {
      return null;
    }
    return parseFloat(price);
  }
}
