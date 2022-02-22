import { createUnionType } from '@nestjs/graphql';
import { MR2000 } from './MR2000';
import { MR3000 } from './MR3000';

/**
 * This type is a Wrapper for the union of MR2000 and MR3000 devices, to be used with TypeORM
 */

export const Device = createUnionType({
  name: 'Device',
  types: () => [MR2000, MR3000],
});
