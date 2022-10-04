import {BaseEntity} from 'src/data/types/BaseEntity';
import {File} from 'src/data/types/File';

/**
 * Class representing an image data object
 */
export class Image extends BaseEntity {
  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    public file: File,
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
  }
}
