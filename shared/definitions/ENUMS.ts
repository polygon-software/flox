export enum DOSSIER_STATUS {
  OPEN = 'OPEN',
  SIGNED = 'SIGNED',
  REJECTED = 'REJECTED',
  SUBMITTED = 'SUBMITTED',
  OFFERED = 'OFFERED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  SENT = 'SENT',
}

export enum OFFER_STATUS {
  INTERESTED = 'INTERESTED',
  RETRACTED = 'RETRACTED',
  ACCEPTED = 'ACCEPTED',
  IN_PROCESS = 'IN_PROCESS',
}

export enum CREATION_STATE {
  APPLIED = 'APPLIED',
  AWAITING_DOCUMENTS = 'AWAITING_DOCUMENTS',
  DOCUMENTS_UPLOADED = 'DOCUMENTS_UPLOADED',
  DONE = 'DONE',
}

export enum ROLE {
  BANK = 'BANK',
  COMPANY = 'COMPANY',
  EMPLOYEE = 'EMPLOYEE',
  SOI_ADMIN = 'SOI_ADMIN',
  SOI_EMPLOYEE = 'SOI_EMPLOYEE',
  NONE = 'NONE',
}

export enum PROPERTY_TYPE {
  ONE_FAMILY_HOUSE = 'ONE_FAMILY_HOUSE',
  APARTMENT = 'APARTMENT',
  APARTMENT_BUILDING = 'APARTMENT_BUILDING',
}

export enum DOSSIER_WARNING {
  AFFORDABILITY = 'AFFORDABILITY',
  ENFEOFFMENT = 'ENFEOFFMENT',
  PROSECUTIONS = 'PROSECUTIONS',
  LOSS_CERTIFICATES = 'LOSS_CERTIFICATES',
  LANDLORD_TYPE = 'LANDLORD_TYPE',
  MORTGAGE_DURATION = 'MORTGAGE_DURATION',
  RETIREMENT = 'RETIREMENT',
  LEASE_DURATION = 'LEASE_DURATION',
}

export enum DOSSIER_FILE_TYPE {
  NONE = 'NONE',
  // Financials
  ID = 'ID',
  SALARY = 'SALARY',
  PENSION = 'PENSION',
  LAST_YEAR_TAX = 'LAST_YEAR_TAX',
  PENSION_ID = 'PENSION_ID',
  LAST_YEAR_SALARY = 'LAST_YEAR_SALARY',
  DEBT_COLLECTION = 'DEBT_COLLECTION',
  OWN_FUNDS = 'OWN_FUNDS',
  THREE_A = 'THREE_A',
  LIFE_INSURANCE = 'LIFE_INSURANCE',
  LEASING_CONTRACT = 'LEASING_CONTRACT',
  CREDIT_CONTRACT = 'CREDIT_CONTRACT',
  WORK_CONTRACT = 'WORK_CONTRACT',
  MARRIAGE_CONTRACT = 'MARRIAGE_CONTRACT',

  // Property
  MORTGAGE_CONTRACT = 'MORTGAGE_CONTRACT',
  PRODUCT_AGREEMENT = 'PRODUCT_AGREEMENT',
  BUILDING_INSURANCE = 'BUILDING_INSURANCE',
  OWNER_REGULATIONS = 'OWNER_REGULATIONS',
  MANAGEMENT_REGULATIONS = 'MANAGEMENT_REGULATIONS',
  FLOOR_PLANS = 'FLOOR_PLANS',
  PICTURES = 'PICTURES',
  PURCHASE_CONTRACT = 'PURCHASE_CONTRACT',
  RENOVATIONS = 'RENOVATIONS',
  LEGACY_CADASTER = 'LEGACY_CADASTER',
  LAND_REGISTER_EXTRACT = 'LAND_REGISTER_EXTRACT',
  BUILDING_DESCRIPTION = 'BUILDING_DESCRIPTION',
  RESERVATION_CONTRACT = 'RESERVATION_CONTRACT',
  MARKET_VALUE_ESTIMATE = 'MARKET_VALUE_ESTIMATE',
  SALES_DOCUMENTATION = 'SALES_DOCUMENTATION',
  SITUATION_PLAN = 'SITUATION_PLAN',

  // Additional
  ADDITIONAL_DOCUMENTS = 'ADDITIONAL_DOCUMENTS',
}
