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
