import axios from 'axios';
import {useApolloClient} from '@vue/apollo-composable';


/**
 * upload a list of files to given enpoint
 * @param {Record<string, unknown>} files - dictionary file filenames vs file
 * @param {string} target - url to upload to
 * @return {Promise<void>} - Done
 */
// eslint-disable-next-line sonarjs/cognitive-complexity,require-jsdoc
export async function uploadFiles(files: Record<string, unknown>, target: string, entityLocation: string) {
  for (const fileKey of Object.keys(files)) {
    const formData = new FormData();
    if (files[fileKey]) {
      // Convert to Blob and append
      const blob = files[fileKey] as Blob
      formData.append('file', blob)
      let iter = 0
      let res:string|null = 'Schnabeltier'
      let token:string|null = ''
      while (res){
        res = localStorage.key(iter)
        if(res?.endsWith('.idToken') && res?.startsWith('CognitoIdentityServiceProvider.')){
          token = localStorage.getItem(res)
          break
        }
        iter+=1
      }
      if(!token){
        throw new Error('Authentication Failure')
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL ?? ''
      const reqRes = await axios({
        method: 'post',
        url: `${baseUrl}${target}`,
        data: formData,
        headers: headers,
      }).catch((e: Error) => {
        throw new Error(`File upload error: ${e.message}`)
      })
      const updatedEntity = reqRes.data as Record<string, unknown>
      const apolloClient = useApolloClient().resolveClient()
      apolloClient.cache.modify({
        id: updatedEntity.uuid as string,
        fields: {
          [entityLocation](){
            return updatedEntity.pdf
          }
        }
      })

    }


  }
}
