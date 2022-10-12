import { BaseEntity } from 'src/data/types/BaseEntity';

/**
 * A class representing a user data object
 */
export class S3File extends BaseEntity {

  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    public key: string,
    public mimetype: string,
    public filename: string | null,
    public size: number,
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
  }
}
