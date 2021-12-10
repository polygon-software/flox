import { registerEnumType } from '@nestjs/graphql';

export enum CURRENCY {
  CHF = 'CHF',
  EUR = 'EUR',
  USD = 'USD',
}

export enum CATEGORY {
  TECHNOLOGY = 'TECHNOLOGY',
  // TODO others
}

export enum PRODUCT_STATUS {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED', // TODO proper definitions: what statuses are possible
  WON = 'WON',
  ARCHIVED = 'ARCHIVED',
}

export enum SELECTABLE_PRODUCT_STATUS {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
}

registerEnumType(CURRENCY, { name: 'Currency' });
registerEnumType(CATEGORY, { name: 'Category' });
registerEnumType(PRODUCT_STATUS, { name: 'ProductStatus' });
