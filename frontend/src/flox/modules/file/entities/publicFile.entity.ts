import {FileEntity} from 'src/flox/modules/file/entities/file.entity';

/**
 * A class representing a file
 */
export class PublicFileEntity extends FileEntity {
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
