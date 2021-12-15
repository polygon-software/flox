import { registerEnumType } from '@nestjs/graphql';

// Currencies
export enum CURRENCY {
  CHF = 'CHF',
  EUR = 'EUR',
  USD = 'USD',
}

// Product categories / interests
export enum CATEGORY {
  TECHNOLOGY = 'TECHNOLOGY',
  // TODO others
}

// Product statuses
export enum PRODUCT_STATUS {
  DRAFT = 'DRAFT',
  VALID = 'VALID',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED', // TODO proper definitions: what statuses are possible
  ARCHIVED = 'ARCHIVED',
}

// User roles
export enum ROLE {
  PLAYER = 'PLAYER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN',
  NONE = 'NONE',
}

registerEnumType(CURRENCY, { name: 'Currency' });
registerEnumType(CATEGORY, { name: 'Category' });
registerEnumType(PRODUCT_STATUS, { name: 'ProductStatus' });
registerEnumType(ROLE, { name: 'Role' });
