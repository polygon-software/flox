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
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED', // TODO proper definitions: what statuses are possible
  WON = 'WON',
  ARCHIVED = 'ARCHIVED'
}

export enum PRODUCT_TYPE {
  NORMAL = 'normal', // TODO proper definitions: what types are possible
  PROMOTION = 'promotion'
}
