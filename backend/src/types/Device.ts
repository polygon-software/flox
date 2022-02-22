import { createUnionType } from '@nestjs/graphql';
import { MR2000 } from './MR2000';
import { MR3000 } from './MR3000';

export const Device = createUnionType({
  name: 'Device',
  types: () => [MR2000, MR3000],
});
