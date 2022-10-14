/**
 * Base entity class that others inherit from.
 * Includes unique UUID, as well as creation/modification/deletion timestamps
 */
export abstract class BaseEntity {
  // eslint-disable-next-line require-jsdoc
  constructor(
    public uuid: string,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date|null,
  ) { }
}
