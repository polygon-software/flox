import axios from 'axios';

import { invalidateTables } from 'src/apollo/invalidation';
import FileEntity from 'src/flox/modules/file/entities/file.entity';
import {
  createFile,
  FileInputs,
} from 'src/flox/modules/file/services/file.service';

import { TABLES } from '../../../enum/TABLES';

export type SelectedFile = {
  content: File;
  url: string;
  status: string;
};

/**
 * Uploads a single file to a given endpoint
 *
 * @param file - File that should be uploaded
 * @param fileInputs - additional inputs that are passed to the file creation API call
 * @returns Whether the upload was successful or not
 */
export async function uploadFile(
  file: SelectedFile,
  fileInputs: FileInputs
): Promise<FileEntity> {
  const headers = {
    'Content-Type': file.content.type,
  };

  const createdFile = await createFile(
    file.content.name,
    file.content.type,
    file.content.size,
    fileInputs
  );
  if (!createdFile || !createdFile.signedUrl) {
    throw new Error('Unable to create file');
  }

  await axios
    .put(createdFile.signedUrl, file.content, {
      headers,
    })
    .catch((e: Error) => {
      throw new Error(`File upload error: ${e.message}`);
    });

  invalidateTables([TABLES.FILE]);

  // Return updated objects
  return createdFile;
}
