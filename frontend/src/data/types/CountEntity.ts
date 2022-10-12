import {BaseEntity} from 'src/data/types/BaseEntity';

export default interface CountQuery<T extends BaseEntity> {
  data: T[],
  count: number,
}
