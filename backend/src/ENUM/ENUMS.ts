import { registerEnumType } from '@nestjs/graphql';

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
registerEnumType(DOSSIER_STATUS, { name: 'DossierStatus' });
registerEnumType(OFFER_STATUS, { name: 'OfferStatus' });
registerEnumType(OFFER_STATUS, { name: 'OfferStatus' });
registerEnumType(ROLE, { name: 'Roles' });
registerEnumType(CREATION_STATE, { name: 'creationState' });
