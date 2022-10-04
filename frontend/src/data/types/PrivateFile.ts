import {File} from 'src/data/types/File';

/**
 * A class representing a file
 */
export class PrivateFile extends File {

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
    public expires: number | null,
  ) {
    super(uuid, createdAt, updatedAt, deletedAt, key, mimetype, filename, size);
  }
}
