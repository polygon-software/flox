import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';

export default interface ExtendedEntity<T extends BaseEntity> {
  data: T;
}
