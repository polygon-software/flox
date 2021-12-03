import { registerEnumType } from '@nestjs/graphql';

export enum CURRENCY {
  CHF = 'chf',
  EUR = 'eur',
  USD = 'usd',
}

registerEnumType(CURRENCY, { name: 'Currency' });

export enum CATEGORY {
  TECHNOLOGY = 'technology',
  // TODO others
}

registerEnumType(CATEGORY, { name: 'Category' });

export enum PRODUCT_STATUS {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ENDED = 'ended', // TODO proper definitions: what statuses are possible
  WON = 'won',
}
registerEnumType(PRODUCT_STATUS, { name: 'ProductStatus' });
