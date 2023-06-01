import { IsOptional, IsUUID } from 'class-validator';

import CreateImageFileInput from 'src/data/imageFile/dto/input/createImageFileInput';
import FileEntity from 'src/flox/modules/file/entities/file.entity';

export default class UpdateImageFileInput extends CreateImageFileInput {
  @IsUUID()
  @IsOptional()
  uuid?: string;

  /**
   * Constructor for CreateImageFileInput
   * @param [filename] - The filename of the imageFile
   * @param [path] - The path of the imageFile
   * @param [mimetype] - The mimetype of the imageFile
   * @param [size] - The size of the imageFile
   * @param [uuid] - The uuid of the imageFile
   * @returns - The imageFile input for update
   */
  constructor(
    filename?: string,
    path?: string,
    mimetype?: string,
    size?: number,
    uuid?: string
  ) {
    super();
    this.filename = filename;
    this.path = path;
    this.mimetype = mimetype;
    this.size = size;
    this.uuid = uuid;
  }

  /**
   * Transform FileEntity to input
   */
  static fromFile(file?: FileEntity): UpdateImageFileInput {
    return new UpdateImageFileInput(
      file?.filename,
      file?.path,
      file?.mimetype,
      file?.size,
      file?.uuid
    );
  }
}
