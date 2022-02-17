import { registerEnumType } from '@nestjs/graphql';

// User roles
export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

registerEnumType(ROLE, { name: 'Role' });
