import axios from 'axios';
import {useApolloClient} from '@vue/apollo-composable';

/**
 * Upload a list of private files to given Endpoint
 * @param {Record<string, unknown>} files - dictionary file filenames vs file
 * @param {string} target - url to upload to
 * @param {string} queryname - Name of the query that got invalidated by request
 * @return {Promise<Record<string, unknown>>} - Updated related files
 */
export async function uploadPrivateFiles(files: Record<string, unknown>, target: string, queryname: string) {
  const apolloClient = useApolloClient().resolveClient()
  let iter = 0
  let res:string|null = ''
  let token:string|null = ''
  do {
    res = localStorage.key(iter)
    if(res?.endsWith('.idToken') && res?.startsWith('CognitoIdentityServiceProvider.')){
      token = localStorage.getItem(res)
      break
    }
    iter++;
  } while (res)
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

  await apolloClient.refetchQueries({include: [queryname]})

  // Return updated objects
  return uploadResult.data as Record<string, unknown>;
}

/**
 * Upload user ID files and associates them to user
 * @param {Record<string, File>} files - dictionary file filenames vs file
 * @param {string} userUuid - user UUID
 * @return {Promise<Record<string, unknown>>} - Updated related files
 */
export async function uploadUserIdFiles(files: Record<string, File>, userUuid: string) {
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
    url: `${baseUrl}/uploadUserIdFiles?uid=${userUuid}`,
    data: formData,
  }).catch((e: Error) => {
    throw new Error(`File upload error: ${e.message}`)
  })

  // Return updated objects
  return uploadResult.data as Record<string, unknown>;
}
