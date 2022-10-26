/**
 * Base entity class that others inherit from.
 * Includes unique UUID, as well as creation/modification/deletion timestamps
 */
export default class BaseEntity {
  uuid: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;

  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
  ) {
    this.uuid = uuid;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
