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
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  ENDED = 'Ended', // TODO proper definitions: what statuses are possible
  WON = 'Won',
  ARCHIVED = 'Archived'
}

export enum PRODUCT_TYPE {
  NORMAL = 'Normal', // TODO proper definitions: what types are possible
  PROMOTION = 'Promotion'
}
