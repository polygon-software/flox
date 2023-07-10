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
   * @param [articleNumber] - The number of the article
   * @param [manufacturerNumber] - The manufacturer number of the article
   * @param [name] - The name of the article
   * @param [description] - The description of the article
   * @param [amount] - The amount of the article
   * @param [price] - The price of the article
   * @param [discount] - The discount for the article
   * @param [uuid] - The uuid of the article
   */
  constructor(
    articleNumber?: string,
    manufacturerNumber?: string,
    name?: string,
    description?: string,
    amount?: number,
    price?: number,
    discount?: number,
    uuid?: string
  ) {
    super();
    this.uuid = uuid;
    this.articleNumber = articleNumber;
    this.manufacturerNumber = manufacturerNumber;
    this.name = name;
    this.description = description;
    this.amount = amount;
    this.price = price;
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
      article?.name,
      article?.description,
      article?.amount,
      article?.price,
      article?.discount,
      article?.uuid
    );
  }
}
