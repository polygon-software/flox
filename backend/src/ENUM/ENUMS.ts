import { registerEnumType } from '@nestjs/graphql';

export enum STATUS {
  CREATED = 'CREATED',
  ACCECPTED = 'ACCECPTED',
  RECJETED = 'RECJETED',
}

export enum CREATION_STATE {
  APPLIED = 'APPLIED',
  AWAITING_DOCUMENTS = 'AWAITING_DOCUMENTS',
  DOCUMENTS_UPLOADED = 'DOCUMENTS_UPLOADED',
  DONE = 'DONE',
}

export enum ROLES {
  BANK = 'BANK',
  COMPANY = 'COMPANY',
  EMPLOYEE = 'EMPLOYEE',
  SOI_ADMIN = 'SOI_ADMIN',
  SOI_EMPLOYEE = 'SOI_EMPLOYEE',
  NONE = 'NONE',
}
registerEnumType(STATUS, { name: 'Status' });
registerEnumType(ROLES, { name: 'Roles' });
registerEnumType(CREATION_STATE, { name: 'creationState' });
