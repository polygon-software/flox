import { registerEnumType } from '@nestjs/graphql';

// User roles
export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum PERMISSION {
  MR2000 = 'MR2000',
  MR3000 = 'MR3000',
  PROJECT = 'PROJECT',
}

registerEnumType(ROLE, { name: 'Role' });
