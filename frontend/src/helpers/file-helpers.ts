import axios from 'axios';
import {useApolloClient} from '@vue/apollo-composable';
import {getAuthToken} from 'src/helpers/cookie-helpers';

/**
 * Upload a list of files to given Endpoint
 * @param {Record<string, unknown>} files - dictionary file filenames vs file
 * @param {string} target - url to upload to
 * @param {string} [queryName] - Name of the query that got invalidated by request, if any
 * @return {Promise<Record<string, unknown>>} - Updated related files
 */
export async function uploadFiles(files: Record<string, unknown>, target: string, queryName?: string) {
  const apolloClient = useApolloClient().resolveClient()
  const token = getAuthToken()
  if(!token){
    throw new Error('Authentication Failure')
  }

  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`
  }

  const formData = new FormData();
  for (const fileKey of Object.keys(files)) {
    if (files[fileKey]) {
      // Convert to Blob and append
      const blob = files[fileKey] as Blob
      formData.set(fileKey, blob)
    }
  }
  const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL ?? ''
  const uploadResult = await axios({
    method: 'post',
    url: `${baseUrl}${target}`,
    data: formData,
    headers: headers,
  }).catch((e: Error) => {
    throw new Error(`File upload error: ${e.message}`)
  })

  if(queryName){
    await apolloClient.refetchQueries({include: [queryName]})
  }

  // Return updated objects
  return uploadResult.data as Record<string, unknown>;
}

