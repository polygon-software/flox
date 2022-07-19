import { createUploaderComponent } from 'quasar'
import {computed, ref} from 'vue'
import {useApolloClient} from '@vue/apollo-composable';
import axios from 'axios';
import {uploadFiles} from 'src/helpers/tools/file-helpers';

// export a Vue component
export default createUploaderComponent({
  name: 'ExtendedUploader',

  props: {
    url: {type: String, required: true, default: ''},
    fieldName: {
      type: [ String ],
      default: () => {
        return (file: File) => file.name
      }
    },
    headers: {type: Object, default: {}},
    formFields: Array,
    withCredentials: {type: Boolean, default: false},
    sendRaw: {type: Boolean, default: true},
    batch: {type: Boolean, default: false},
    target: {type: String, default: ''},
    queryName: {type: String, default: ''}
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
     * on failed upload
     * @param {Array<File>} files - failed files
     * @return {void}
     */
    function onFailed (files: Array<File>) {
      helpers.queuedFiles.value = helpers.queuedFiles.value.concat(files)
      files.forEach(f => {
        helpers.updateFileStatus(f, 'failed')
      })
      workingThreads.value--
      emit('failed', { files, helpers }) // TODO: second prop should be request that was used for uploading
    }
     // [ REQUIRED! ]
    /**
     * Start the uploading process
     * @return {void}
     */
    async function upload() {
      workingThreads.value++
      const files: Array<File> = helpers.queuedFiles.value.slice(0)
      helpers.queuedFiles.value = []

      // if (!url) {
      //   console.error('q-uploader: invalid or no URL specified')
      //   onFailed()
      //   return
      // }

      const filesDict: Record<string, File> = {}
      for (const file of files) {
        filesDict[file.name] = file
        helpers.updateFileStatus(file, 'uploading', file.size)
      }

      // USE HELPERS FILE - problem with abort and updating file status
      // const result = await uploadFiles(filesDict, '', '')
      // workingThreads.value--


      // DON'T USE HELPERS FILE
      const formData = new FormData();
      const fields = props.formFields
      if (fields !== undefined) {
        console.log('fields')
        fields.forEach((field: {name: string, value: string}) => {
          formData.append(field.name, field.value)
        })
      }

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
        onFailed(files)
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

      await axios({
        method: 'post',
        url: `https://${props.url}${props.target}`,
        data: formData,
        headers: headers,
        signal: controller.signal
      }).then(() => {
        files.forEach(f => {
          helpers.updateFileStatus(f, 'uploaded')
        })
        emit('uploaded', { files, helpers }) // TODO: second prop should be request that was used for uploading
      })
        .catch((e: Error) => {
          onFailed(files)
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
