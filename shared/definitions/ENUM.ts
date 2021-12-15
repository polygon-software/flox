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

// User roles
export enum ROLE {
  PLAYER = 'PLAYER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN',
  NONE = 'NONE',
}
