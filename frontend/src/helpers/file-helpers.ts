import axios from 'axios';

/**
 * upload a list of files to given enpoint
 * @param {Record<string, unknown>} files - dictionary file filenames vs file
 * @param {string} target - url to upload to
 * @return {Promise<void>} - Done
 */
export async function uploadFiles(files: Record<string, unknown>, target: string) {
  for (const fileKey of Object.keys(files)) {
    const formData = new FormData();
    if (files[fileKey]) {
      // Convert to Blob and append
      const blob = files[fileKey] as Blob
      formData.append('file', blob)
      const token = localStorage?.getItem('CognitoIdentityServiceProvider.5h4fcam55ktksdcd0cskqidcsj.8362789d-b4b1-4afc-a0a2-5a83285e4ad5.idToken')
      if (!token) {
        throw new Error('Authentication Failure')
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL ?? ''
      await axios({
        method: 'post',
        url: `${baseUrl}${target}`,
        data: formData,
        headers: headers,
      }).catch((e: Error) => {
        throw new Error(`File upload error: ${e.message}`)
      })
    }


  }
}
