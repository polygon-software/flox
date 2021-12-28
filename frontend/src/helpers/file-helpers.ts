import axios from 'axios';
import {QUERIES} from 'src/data/queries/QUERIES';
import {MutationTypes, QueryObject} from 'src/data/DATA-DEFINITIONS';
import {useApolloClient} from '@vue/apollo-composable';
import {updateAffectedQueries} from 'src/helpers/data-helpers';
import {CREATE_DOSSIER} from 'src/data/mutations/DOSSIER';

/**
 * upload a list of files to given enpoint
 * @param {Record<string, unknown>} files - dictionary file filenames vs file
 * @param {string} target - url to upload to
 * @param {Array<string>} tables - tables affected by this upload
 * @return {Promise<void>} - Done
 */
// eslint-disable-next-line sonarjs/cognitive-complexity,require-jsdoc
export async function uploadFiles(files: Record<string, unknown>, target: string, tables: Array<string> = []) {
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
        console.log(res)
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
      const newFile = await axios({
        method: 'post',
        url: `${baseUrl}${target}`,
        data: formData,
        headers: headers,
      }).catch((e: Error) => {
        throw new Error(`File upload error: ${e.message}`)
      })
      console.log(newFile)

      // Cache fixing
      const affectedQueries:QueryObject[] = [];
      QUERIES.forEach((query: QueryObject) => {
        // If any of the mutation's affected tables are relevant to query, add to list of affected queries
        if(tables.some(t => query.tables.indexOf(t) >= 0)){
          affectedQueries.push(query)
        }
      })

      // Todo: Update Cache
      console.log(affectedQueries)
      const apolloClient = useApolloClient().resolveClient()
      updateAffectedQueries(
        apolloClient.cache,
        affectedQueries,
        {mock: newFile.data as Record<string, unknown>},
        {
          type: MutationTypes.UPDATE,
          cacheLocation: 'mock',
          mutation: CREATE_DOSSIER.mutation,
          tables: []
        }
      )
    }


  }
}
