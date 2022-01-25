import Joi, { Schema } from 'joi';
import { ProductItem } from '../../../../shared/schemas/ProductItem';
import {
  CATEGORY,
  CURRENCY,
  PRODUCT_STATUS,
} from '../../../../shared/definitions/ENUM';

/**
 * A class representing a product
 */
export class Product {
  title: string;
  description: string;
  brand: string;
  category: CATEGORY;
  value: number;
  currency: CURRENCY;
  start: Date;
  end: Date;
  pictures: Record<string, string>[];
  status: PRODUCT_STATUS;
  sponsored: boolean;
  directBuyLink: string;
  directBuyLinkCLicks: number;
  directBuyLinkMaxClicks: number;
  directBuyLinkCost: number;
  directBuyLinkMaxCost: number;
  brandLink: string;
  brandLinkClicks: number;
  brandLinkMaxClicks: number;
  brandLinkCost: number;
  brandLinkMaxCost: number;
  minBet: number;
  maxBet: number;
  tags: string[];
  comments: Record<string, string>[];
  likes: number;

  /**
   * Constructor
   * @param {string} title - title
   * @param {string} description - description
   * @param {string} brand - brand
   * @param {CATEGORY} category - category
   * @param {number} value - value
   * @param {CURRENCY} currency - currency
   * @param {Date} start - start
   * @param {Date} end - end
   * @param {Record<string, string>[]} pictures - pictures
   * @param {PRODUCT_STATUS} status - status
   * @param {boolean} sponsored - sponsored
   * @param {string} directBuyLink - direct buy link
   * @param {number} directBuyLinkCLicks - direct buy link clicks
   * @param {number} directBuyLinkMaxClicks - direct buy link max clicks
   * @param {number} directBuyLinkCost - direct buy link cost
   * @param {number} directBuyLinkMaxCost - direct buy link max cost
   * @param {string} brandLink - brand link
   * @param {number} brandLinkClicks - brand link clicks
   * @param {number} brandLinkMaxClicks - brand link max clicks
   * @param {number} brandLinkCost - brand link cost
   * @param {number} brandLinkMaxCost - brand link max cost
   * @param {number} minBet - minimum bet
   * @param {number} maxBet - maximum bet
   * @param {string[]} tags - tags
   * @param {Record<string, string>[]} comments - comments
   * @param {number} likes - likes
   */
  constructor(
    title: string,
    description: string,
    brand: string,
    category: CATEGORY,
    value: number,
    currency: CURRENCY,
    start: Date,
    end: Date,
    pictures: Record<string, string>[],
    status: PRODUCT_STATUS,
    sponsored: boolean,
    directBuyLink: string,
    directBuyLinkCLicks: number,
    directBuyLinkMaxClicks: number,
    directBuyLinkCost: number,
    directBuyLinkMaxCost: number,
    brandLink: string,
    brandLinkClicks: number,
    brandLinkMaxClicks: number,
    brandLinkCost: number,
    brandLinkMaxCost: number,
    minBet: number,
    maxBet: number,
    tags: string[],
    comments: Record<string, string>[],
    likes: number
  ) {
    this.title = title;
    this.description = description;
    this.brand = brand;
    this.category = category;
    this.value = value;
    this.currency = currency;
    this.start = start;
    this.end = end;
    this.pictures = pictures;
    this.status = status;
    this.sponsored = sponsored;
    this.directBuyLink = directBuyLink;
    this.directBuyLinkCLicks = directBuyLinkCLicks;
    this.directBuyLinkMaxClicks = directBuyLinkMaxClicks;
    this.directBuyLinkCost = directBuyLinkCost;
    this.directBuyLinkMaxCost = directBuyLinkMaxCost;
    this.brandLink = brandLink;
    this.brandLinkClicks = brandLinkClicks;
    this.brandLinkMaxClicks = brandLinkMaxClicks;
    this.brandLinkCost = brandLinkCost;
    this.brandLinkMaxCost = brandLinkMaxCost;
    this.minBet = minBet;
    this.maxBet = maxBet;
    this.tags = tags;
    this.comments = comments;
    this.likes = likes;
  }

  /**
   * Validates the product to Joi schema
   * @returns {boolean} whether the product fits the schema
   */
  validate(): boolean {
    try {
      Joi.assert(this, ProductItem as unknown as Schema);
      return true;
    } catch (e) {
      return false;
    }
  }
}
