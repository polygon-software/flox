import { registerEnumType } from '@nestjs/graphql';

export enum STATUS {
  OPEN = 'OPEN',
  SIGNED = 'SIGNED',
  REJECTED = 'REJECTED',
  SUBMITTED = 'SUBMITTED',
  OFFERED = 'OFFERED',
  COMPLETED = 'COMPLETED',
  IN_PROCESS = 'IN_PROCESS',
  SENT = 'SENT',
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
registerEnumType(STATUS, { name: 'Status' });
registerEnumType(ROLE, { name: 'Roles' });
registerEnumType(CREATION_STATE, { name: 'creationState' });
