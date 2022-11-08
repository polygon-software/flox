/**
 * A class representing a folder
 */
import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';

export default class FolderEntity extends BaseEntity {
  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    public name: string,
    public files: number,
    public size: number
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
  }
}
