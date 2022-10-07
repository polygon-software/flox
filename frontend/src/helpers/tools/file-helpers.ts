import axios, {AxiosResponse} from 'axios';
import {useApolloClient} from '@vue/apollo-composable';
import {getBearerToken} from 'src/helpers/tools/auth-helpers';
import {S3File} from 'src/data/types/S3File';
import {createImage} from 'src/helpers/data/mutation-helpers';

/**
 * Uploads a single file to a given endpoint
 * @param {File} file - File that should be uploaded
 * @param {string} url - The url to upload to
 * @param {string} [queryName] - Name of the query that got invalidated by request
 * @return {Promise<AxiosResponse>} - Whether the upload was successful or not
 */
export async function uploadFile(
  file: File,
  url: string,
  queryName?: string
): Promise<AxiosResponse> {
  const formData = new FormData();
  formData.append('file', file as Blob);

  const apolloClient = useApolloClient().resolveClient();

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
  const imageDetails = uploadResult.data as S3File;

  if (file.type.split('/')[0] === 'image') {
    await createImage(imageDetails.uuid, true);
  }

  if (queryName) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await apolloClient.refetchQueries({ include: [queryName] });
  }

  // Return updated objects
  return uploadResult;
}
