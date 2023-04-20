/* eslint-disable @typescript-eslint/naming-convention */
import { registerEnumType } from '@nestjs/graphql';

enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

registerEnumType(ROLE, { name: 'Role' });
export default ROLE;
