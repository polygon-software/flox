import { registerEnumType } from '@nestjs/graphql';

export enum CURRENCY {
  CHF = 'chf',
  EUR = 'eur',
  USD = 'usd',
}

export enum CATEGORY {
  TECHNOLOGY = 'technology',
  // TODO others
}

export enum PRODUCT_STATUS {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ENDED = 'ended', // TODO proper definitions: what statuses are possible
  WON = 'won',
}

registerEnumType(CURRENCY, { name: 'Currency' });
registerEnumType(CATEGORY, { name: 'Category' });
registerEnumType(PRODUCT_STATUS, { name: 'ProductStatus' });
