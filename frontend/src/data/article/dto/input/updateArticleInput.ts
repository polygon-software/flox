import { IsOptional, IsString } from 'class-validator';

import CreateArticleInput from 'src/data/article/dto/input/createArticleInput';
import ArticleEntity from 'src/data/article/entities/articleEntity';

/**
 * A class representing an input object for updating an article data object
 */
export default class UpdateArticleInput extends CreateArticleInput {
  @IsString()
  @IsOptional()
  uuid?: string;

  /**
   * Constructor for UpdateArticleInput
   * @param {string} [articleNumber] - The number of the article
   * @param {string} [manufacturerNumber] - The manufacturer number of the article
   * @param {number} [amount] - The amount of the article
   * @param {number} [discount] - The discount for the article
   * @param {string} [uuid] - The uuid of the article
   */
  constructor(
    articleNumber?: string,
    manufacturerNumber?: string,
    amount?: number,
    discount?: number,
    uuid?: string
  ) {
    super();
    this.uuid = uuid;
    this.articleNumber = articleNumber;
    this.manufacturerNumber = manufacturerNumber;
    this.amount = amount;
    this.discount = discount;
  }

  /**
   * Transform ArticleEntity to input
   * @param {ArticleEntity} article - The article entity from the database
   * @returns {UpdateArticleInput} - The article input for update
   */
  static fromArticle(article?: ArticleEntity): UpdateArticleInput {
    return new UpdateArticleInput(
      article?.articleNumber,
      article?.manufacturerNumber,
      article?.amount,
      article?.discount,
      article?.uuid
    );
  }
}
