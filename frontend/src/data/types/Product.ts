/* eslint-disable sonarjs/cognitive-complexity */

import Joi, { Schema } from 'joi';
import { ProductItem } from '../../../schemas/ProductItem';
import {
  CATEGORY,
  CURRENCY,
  PRODUCT_STATUS,
} from '../../../definitions/ENUM';

export interface ProductParams {
  uuid?: string;
  title?: string;
  description?: string;
  brand?: string;
  category?: CATEGORY;
  value?: number;
  currency?: CURRENCY;
  start?: Date;
  end?: Date;
  pictures?: Record<string, string>[];
  status?: PRODUCT_STATUS;
  sponsored?: boolean;
  directBuyLink?: string;
  directBuyLinkCLicks?: number;
  directBuyLinkMaxClicks?: number;
  directBuyLinkCost?: number;
  directBuyLinkMaxCost?: number;
  brandLink?: string;
  brandLinkClicks?: number;
  brandLinkMaxClicks?: number;
  brandLinkCost?: number;
  brandLinkMaxCost?: number;
  minBet?: number;
  maxBet?: number;
  tags?: string[];
  comments?: Record<string, string>[];
  likes?: number;
}

/**
 * A class representing a product
 */
export class Product {
  uuid: string | null;
  title: string | null;
  description: string | null;
  brand: string | null;
  category: CATEGORY | null;
  value: number | null;
  currency: CURRENCY;
  start: Date | null;
  end: Date | null;
  pictures: Record<string, string>[];
  status: PRODUCT_STATUS;
  sponsored: boolean | null;
  directBuyLink: string | null;
  directBuyLinkCLicks: number | null;
  directBuyLinkMaxClicks: number | null;
  directBuyLinkCost: number | null;
  directBuyLinkMaxCost: number | null;
  brandLink: string | null;
  brandLinkClicks: number | null;
  brandLinkMaxClicks: number | null;
  brandLinkCost: number | null;
  brandLinkMaxCost: number | null;
  minBet: number | null;
  maxBet: number | null;
  tags: string[];
  comments: Record<string, string>[];
  likes: number;

  /**
   * Constructor
   * @param {ProductParams} params - params
   */
  constructor(params: ProductParams) {
    this.uuid = params.uuid || null;
    this.title = params.title || null;
    this.description = params.description || null;
    this.brand = params.brand || null;
    this.category = params.category || null;
    this.value = params.value || null;
    this.currency = params.currency || CURRENCY.CHF;
    this.start = params.start || null;
    this.end = params.end || null;
    this.pictures = params.pictures || [];
    this.status = params.status || PRODUCT_STATUS.DRAFT;
    this.sponsored = params.sponsored || null;
    this.directBuyLink = params.directBuyLink || null;
    this.directBuyLinkCLicks = params.directBuyLinkCLicks || null;
    this.directBuyLinkMaxClicks = params.directBuyLinkMaxClicks || null;
    this.directBuyLinkCost = params.directBuyLinkCost || null;
    this.directBuyLinkMaxCost = params.directBuyLinkMaxCost || null;
    this.brandLink = params.brandLink || null;
    this.brandLinkClicks = params.brandLinkClicks || null;
    this.brandLinkMaxClicks = params.brandLinkMaxClicks || null;
    this.brandLinkCost = params.brandLinkCost || null;
    this.brandLinkMaxCost = params.brandLinkMaxCost || null;
    this.minBet = params.minBet || null;
    this.maxBet = params.maxBet || null;
    this.tags = params.tags || [];
    this.comments = params.comments || [];
    this.likes = params.likes || 0;
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
