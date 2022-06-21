/**
 * Base entity class that others inherit from.
 * Includes unique UUID, as well as creation/modification/deletion timestamps
 */
export class BaseEntity {
  uuid: string;
  createdAt: Date;
  lastModifiedAt: Date;
  deletedAt: Date|null;

  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    lastModifiedAt: Date,
    deletedAt: Date|null,
  ) {
    this.uuid = uuid;
    this.createdAt = createdAt;
    this.lastModifiedAt = lastModifiedAt;
    this.deletedAt = deletedAt
  }
}
