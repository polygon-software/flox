import {BaseEntity} from 'src/data/types/BaseEntity';
import {S3File} from 'src/data/types/S3File';

/**
 * Class representing an image data object
 */
export class ImageFile extends BaseEntity {
  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    public file: S3File,
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
  }
}
