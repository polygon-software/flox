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
  VALID = 'VALID',
  ARCHIVED = 'ARCHIVED',
}

registerEnumType(CURRENCY, { name: 'Currency' });
registerEnumType(CATEGORY, { name: 'Category' });
registerEnumType(PRODUCT_STATUS, { name: 'ProductStatus' });
