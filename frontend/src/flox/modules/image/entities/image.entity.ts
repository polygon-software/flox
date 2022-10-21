import {BaseEntity} from 'src/flox/core/base-entity/entities/BaseEntity';
import {FileEntity} from 'src/flox/modules/file/entities/file.entity';

/**
 * Class representing an image data object
 */
export class ImageEntity extends BaseEntity {
  // eslint-disable-next-line require-jsdoc
  constructor(
    uuid: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    public file: FileEntity,
    public width?: number,
    public height?: number,
    public latitude?: number,
    public longitude?: number,
    public capturedAt?: Date,
  ) {
    super(uuid, createdAt, updatedAt, deletedAt);
  }
}
