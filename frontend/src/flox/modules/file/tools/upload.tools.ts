import axios, { AxiosResponse } from 'axios';
import { getBearerToken } from 'src/flox/modules/auth/tools/auth.tools';
import { FileEntity } from 'src/flox/modules/file/entities/file.entity';
import { TABLES } from 'src/flox/TABLES';
import { createImage } from 'src/flox/modules/image/services/image.service';
import { invalidateTables } from 'src/apollo/invalidation';

/**
 * Uploads a single file to a given endpoint
 * @param {File} file - File that should be uploaded
 * @param {string} url - The url to upload to
 * @return {Promise<AxiosResponse>} - Whether the upload was successful or not
 */
export async function uploadFile(
  file: File,
  url: string
): Promise<AxiosResponse> {
  const formData = new FormData();
  formData.append('file', file as Blob);

  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: getBearerToken(),
  };

  const uploadResult = await axios({
    method: 'post',
    url: url,
    data: formData,
    headers: headers,
  }).catch((e: Error) => {
    throw new Error(`File upload error: ${e.message}`);
  });
  const imageDetails = uploadResult.data as FileEntity;

  if (file.type.split('/')[0] === 'image') {
    await createImage(imageDetails.uuid, true);
  }

  invalidateTables([TABLES.PRIVATE_FILE, TABLES.PUBLIC_FILE, TABLES.IMAGE]);

  // Return updated objects
  return uploadResult;
}
