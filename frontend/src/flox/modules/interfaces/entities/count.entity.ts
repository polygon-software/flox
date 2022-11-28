import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';

export default interface CountQuery<T extends BaseEntity> {
  data: T[];
  count: number;
}
