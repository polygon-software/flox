import axios from 'axios';

import { invalidateTables } from 'src/apollo/invalidation';
import { FileEntity } from 'src/flox/modules/file/entities/file.entity';
import { createImage } from 'src/flox/modules/image/services/image.service';
import { TABLES } from 'src/flox/TABLES';
import { createFile } from 'src/flox/modules/file/services/file.service';

export type SelectedFile = {
  content: File;
  url: string;
  status: string;
};

/**
 * Uploads a single file to a given endpoint
 * @param file - File that should be uploaded
 * @return Whether the upload was successful or not
 */
export async function uploadFile(file: SelectedFile): Promise<FileEntity> {
  const headers = {
    'Content-Type': file.content.type,
  };

  const createdFile = await createFile(
    file.content.name,
    file.content.type,
    file.content.size
  );
  if (createdFile === null || createdFile.signedUrl === null) {
    throw new Error('Unable to create file');
  }

  console.log('GOT SIGNED URL', createdFile.signedUrl);

  await axios
    .put(createdFile.signedUrl, file.content, {
      headers,
    })
    .catch((e: Error) => {
      throw new Error(`File upload error: ${e.message}`);
    });

  console.log({ createdFile });

  if (file.content.type.split('/')[0] === 'image') {
    await createImage(createdFile.uuid, true);
  }

  invalidateTables([TABLES.FILE, TABLES.IMAGE]);

  // Return updated objects
  return createdFile;
}
