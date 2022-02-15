import { registerEnumType } from '@nestjs/graphql';

// User roles
export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
  NONE = 'NONE',
}

registerEnumType(ROLE, { name: 'Role' });
