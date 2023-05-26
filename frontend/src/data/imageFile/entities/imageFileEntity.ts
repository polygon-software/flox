import { IsObject, IsOptional } from 'class-validator';

import FormEntity from 'src/data/form/entities/form.entity';
import FileEntity from 'src/flox/modules/file/entities/file.entity';

/**
 * A class representing an image data object
 */
export default class ImageFileEntity extends FileEntity {
  @IsObject()
  @IsOptional()
  form?: FormEntity;
}
