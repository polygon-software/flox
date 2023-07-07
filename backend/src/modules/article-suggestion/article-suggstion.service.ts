import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import xlsx from 'node-xlsx';

import AbstractSearchService from '../../flox/modules/abstracts/search/abstract-search.service';

import CreateArticleSuggesstionOutput from './dto/output/create-article-suggesstion.output';
import ArticleSuggestion from './entities/article-suggestion.entity';

@Injectable()
export default class ArticleSuggstionService extends AbstractSearchService<ArticleSuggestion> {
  constructor(
    @InjectRepository(ArticleSuggestion)
    private readonly articleSuggestionRepository: Repository<ArticleSuggestion>,
  ) {
    super();
  }

  /**
   * @returns Article suggestion repository
   */
  get repository(): Repository<ArticleSuggestion> {
    return this.articleSuggestionRepository;
  }

  /**
   * Updates the articles suggestion entities with the data from the given ERP export.
   *
   * @param file - File containg the article list
   * @returns The number of created article suggestions
   */
  async createArticleSuggestionList(
    file: Buffer,
  ): Promise<CreateArticleSuggesstionOutput> {
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
      } as ArticleSuggestion;
    });

    // Get the existing articles and delete them
    const articles = await this.repository.find();
    if (articles.length > 0) {
      await this.articleSuggestionRepository.delete(
        articles.map((article) => article.uuid),
      );
    }

    // Save the new articles
    const promiseArray: Promise<ArticleSuggestion>[] = [];
    newArticles.forEach((article) => {
      promiseArray.push(super.create(article));
    });
    await Promise.all(promiseArray);
    return { amount: promiseArray.length } as CreateArticleSuggesstionOutput;
  }

  /**
   * Returns all articles, for which the article nubmer starts with the given
   * search term.
   *
   * @param searchTerm - The term to search for
   * @returns The found articles
   */
  async articleSuggestions(searchTerm: string): Promise<ArticleSuggestion[]> {
    const suggestions = await this.repository
      .createQueryBuilder('article')
      .where('LOWER(article.articleNumber) LIKE LOWER(:searchTerm)', {
        searchTerm: `${searchTerm}%`,
      })
      .getMany();

    // Return the result only if there are 50 suggestions or fewer
    if (suggestions.length > 50) {
      return [];
    }
    return suggestions;
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
