import { registerEnumType } from '@nestjs/graphql';

export enum STATUS {
  CREATED = 'created',
  ACCECPTED = 'accepted',
  RECJETED = 'rejected',
}

export enum ROLES {
  BANK = 'bank',
  COMPANY = 'company',
  EMPLOYEE = 'employee',
  SOI_ADMIN = 'soi-admin',
  SOI_EMPLOYEE = 'soi-employee',
  NONE = 'none',
}
registerEnumType(STATUS, { name: 'Status' });
registerEnumType(ROLES, { name: 'Roles' });
