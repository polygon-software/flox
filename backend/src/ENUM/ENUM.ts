import { registerEnumType } from '@nestjs/graphql';

export enum ROLE {
  PLAYER = 'PLAYER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN',
  NONE = 'NONE',
}

registerEnumType(ROLE, { name: 'Role' });
