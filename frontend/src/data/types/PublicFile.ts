import {S3File} from 'src/data/types/S3File';

/**
 * A class representing a file
 */
export class PublicFile extends S3File {
  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    key: string,
    mimetype: string,
    filename: string | null,
    size: number,
  ) {
    super(uuid, createdAt, updatedAt, deletedAt, key, mimetype, filename, size);
  }
}
