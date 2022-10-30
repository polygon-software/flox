import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';

/**
 * A class representing a file
 */
export class FileEntity extends BaseEntity {
  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    public mimetype: string,
    public filename: string | null,
    public size: number,
    public signedUrl: string | null
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
  }
}
