import { registerEnumType } from '@nestjs/graphql';

// Currencies
export enum CURRENCY {
  CHF = 'CHF',
  EUR = 'EUR',
  USD = 'USD',
}

// Product categories / interests
export enum CATEGORY {
  CARS = 'CARS',
  CELEBRITIES = 'CELEBRITIES',
  COOKING = 'COOKING',
  FASHION = 'FASHION',
  MUSIC = 'MUSIC',
  OUTDOOR = 'OUTDOOR',
  SPORTS = 'SPORTS',
  TECHNOLOGY = 'TECHNOLOGY',
  TOOLS = 'TOOLS',
  TRAVELLING = 'TRAVELLING',
  WATCHES = 'WATCHES',
}

// Product statuses
export enum PRODUCT_STATUS {
  DRAFT = 'DRAFT',
  VALID = 'VALID',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED', // TODO proper definitions: what statuses are possible
  ARCHIVED = 'ARCHIVED',
}

// User statuses
export enum USER_STATUS {
  APPLIED = 'APPLIED',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
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
