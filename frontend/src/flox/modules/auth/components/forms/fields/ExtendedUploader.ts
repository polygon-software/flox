import { createUploaderComponent } from 'quasar'
import {computed, ref} from 'vue'
import {useApolloClient} from '@vue/apollo-composable';
import axios from 'axios';

// export a Vue component
export default createUploaderComponent({
  name: 'ExtendedUploader',

  props: {
    url: {type: String, default: process.env.VUE_APP_BACKEND_BASE_URL ?? ''},
    fieldName: {
      type: String,
      default: () => {
        return (file: File) => file.name
      }
    },
    headers: {type: Object, default: {}},
    formFields: {type: Array},
    withCredentials: {type: Boolean, default: false},
    sendRaw: {type: Boolean, default: true},
    target: {type: String, required: true, default: ''},
    queryName: {type: String, required: true, default: ''}
  },

  emits: [ 'uploaded', 'failed', 'uploading' ],

  injectPlugin ({ props, emit, helpers }) {

    // can call any other composables here
    // as this function will run in the component's setup()
    const workingThreads = ref(0)
    const controller = new AbortController()

    // [ REQUIRED! ]
    // We're working on uploading files
    const isUploading = computed(() => workingThreads.value > 0)

    // [ optional ]
    // Shows overlay on top of the
    // uploader signaling it's waiting
    // on something (blocks all controls)
    const isBusy = ref(false)

    // [ REQUIRED! ]
    /**
     * Abort and clean up any process that is in progress
     * @return {void}
     */
    function abort () {
      controller.abort()
      workingThreads.value--
    }
    /**
     * on failed upload, set status to failed and emit event
     * @param {Array<File>} files - failed files
     * @param {Error} error - the error
     * @return {void}
     */
    function onFailed (files: Array<File>, error: Error) {
      helpers.queuedFiles.value = helpers.queuedFiles.value.concat(files)
      files.forEach(f => {
        helpers.updateFileStatus(f, 'failed')
      })
      workingThreads.value--
      emit('failed', { files, error })
    }
     // [ REQUIRED! ]
    /**
     * upload the files to an endpoint
     * @return {void}
     */
    async function upload() {
      workingThreads.value++
      const files: Array<File> = helpers.queuedFiles.value.slice(0)
      helpers.queuedFiles.value = []

      if (!props.url) {
        onFailed(files, Error('invalid or no URL specified'))
        throw new Error('invalid or no URL specified')
      }

      const filesDict: Record<string, File> = {}
      for (const file of files) {
        filesDict[file.name] = file
        helpers.updateFileStatus(file, 'uploading', file.size)
      }

      const formData = new FormData();
      const fields = props.formFields
      if (fields !== undefined) {
        fields.forEach((field: {name: string, value: string|Blob}|unknown) => {
          formData.append(field.name, field.value) // TODO: fix typescript
        })
      }

      const apolloClient = useApolloClient().resolveClient() // TODO: duplicated code with file-helpers.ts
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
        onFailed(files, Error('Authentication Failure'))
        throw new Error('Authentication Failure')
      }

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
      if (props.sendRaw) {
        for (const fileKey of Object.keys(filesDict)) {
          if (filesDict[fileKey]) {
            // Convert to Blob and append
            const blob = filesDict[fileKey] as Blob
            formData.set(fileKey, blob)
          }
        }
      }

      const promise = await axios({
        method: 'post',
        url: `https://${props.url}${props.target}`,
        data: formData,
        headers: headers,
        signal: controller.signal,
        withCredentials: props.withCredentials
      })
        .then(() => {
        files.forEach(f => {
          helpers.updateFileStatus(f, 'uploaded')
        })
        emit('uploaded', { files, promise })
      })
        .catch((e: Error) => {
          onFailed(files, e)
          throw new Error(`File upload error: ${e.message}`)
        })
      workingThreads.value--
      if (props.queryName) {
        await apolloClient.refetchQueries({include: [props.queryName]})
      }
    }

    return {
      isUploading,
      isBusy,

      abort,
      upload
    }
  }
})
