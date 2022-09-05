<template>
  <FloxWrapper :module="MODULES.FILE">
    <q-card
      class="q-ma-md"
      style="width: 600px;"
    >

      <!--- Header --->
      <q-card-section>
        <div class="row flex-center justify-between">
          <h5 class="q-mx-md col-auto">
            {{ $t('files.file_upload') }}
          </h5>
          <div class="row justify-around col-shrink">
            <!-- Invisible file picker (does not need a model-value, since upload is handled via event) -->
            <q-file
              v-show="false"
              ref="filePicker"
              accept="image/*, .pdf"
              :max-file-size="props.maxFileSize"
              :max-files="props.maxFiles"
              multiple
              @update:model-value="onFilePicked"
            />
            <q-btn
              icon="add"
              flat
              @click="addFile()"
            >
              <q-tooltip>
                {{ $t('files.add') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-show="selectedFiles.length > 0"
              class="col-auto"
              icon="restart_alt"
              flat
              @click="clearFileList()"
            >
              <q-tooltip>
                {{ $t('files.remove_all') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              v-show="selectedFiles.length > 0"
              icon="file_upload"
              flat
              @click="uploadFiles"
            >
              <q-tooltip>
                {{ $t('files.upload') }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-separator inset/>

      <!--- Files --->
      <q-card-section>
        <q-list separator>
          <q-item
            v-for="(file, index) in selectedFiles"
            :key="file.content.name"
            class="row justify-between flex-center"
          >
            <q-item-section class="col-auto">
              <q-item-label>
                {{ file.content.name }}
              </q-item-label>

              <q-item-label caption>
                Status: {{ file.status }}
              </q-item-label>

            </q-item-section>

            <!--- Preview --->
            <q-item-section class="row flex-center col-grow">
              <q-img
                v-if="file.content.type.includes('image/')"
                :src="file.url"
                spinner-color="primary"
                style="max-width: 75%;"
              />
              <q-item-label
                v-else
              >
                {{ $t('files.no_preview') }}
              </q-item-label>
            </q-item-section>

            <q-item-section
              top
              side
            >
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="removeFile(index)"
              >
                <q-tooltip>
                  {{ $t('files.remove') }}
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </FloxWrapper>
</template>

<script setup lang="ts">
import {
  QFile,
  QVueGlobals,
  useQuasar,
} from 'quasar';
import {defineProps, Ref, ref} from 'vue';
import { AxiosResponse } from 'axios';
import FloxWrapper from 'src/flox/core/components/FloxWrapper.vue';
import {MODULES} from 'src/flox/MODULES'
import {uploadFile} from 'src/helpers/tools/file-helpers'
import {i18n} from 'boot/i18n';

interface SelectedFile {
  content: File,
  url: string,
  status: string,
}

const $q: QVueGlobals = useQuasar()

const props = defineProps({
  acceptedFiles: {
    type: String,
    default: '.jpg, .pdf, image/*'
  },
  autoUpload: {
    type: Boolean,
    default: false
  },
  hideUploadButton: {
    type: Boolean,
    default: false
  },
  maxFiles: {
    type: Number,
    default: 100
  },
  maxFileSize: {
    type: Number,
    default: 5e7
  },
  maxTotalSize: {
    type: Number,
    default: 5e7
  },
  multiple: {
    type: Boolean,
    default: true
  },
  queryName: {
    type: String,
    required: true,
  },
  sendRaw: {
    type: Boolean,
    default: true
  },
  target: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: process.env.VUE_APP_BACKEND_URL ?? ''
  }
})

const showQFile = ref(false)
const filePicker: Ref<QFile|null> = ref(null)
const selectedFiles: Ref<Array<SelectedFile>> = ref([])

/**
 * if the upload has failed notify the user
 * @param {Array<SelectedFile>} failedEntries - failed entries
 * @return {void} void
 */
function onFailed (failedEntries: Array<SelectedFile>) {
  $q.notify({
    type: 'negative',
    message: i18n.global.t('files.failed_upload', {value: failedEntries.length})
  })
}

/**
 * if the upload was successful notify the user
 * @param {Array<SelectedFile>} successfulEntries - successful entries
 * @return {void} void
 */
function onSuccess (successfulEntries: Array<SelectedFile>) {
  $q.notify({
    type: 'positive',
    message: i18n.global.t('files.successfully_uploaded', {value: successfulEntries.length})
  })
}

/**
 * Open the dialog to select files for upload
 * @returns {void} - done
 */
function addFile() {
  showQFile.value = true
  filePicker.value?.pickFiles()
}

/**
 * Removes a file from the file list
 * @param {int} index - The index of file to remove
 * @return {void} void
 */
function removeFile(index: number) {
  selectedFiles.value.splice(index)
}

/**
 * Removes all files that have been selected so far
 * @return {void} void
 */
function clearFileList() {
  selectedFiles.value = []
}

/**
 * Triggered when a file is picked from the file picker dialog
 * @param {File[]} newFiles - the newly picked files
 * @returns {void}
 */
function onFilePicked(newFiles: File[]){
  showQFile.value = false
  for (const file of newFiles) {
    const newSelectedFile: SelectedFile = {
      content: file,
      url: URL.createObjectURL(file),
      status: i18n.global.t('files.status_ready'),
    }
    selectedFiles.value = selectedFiles.value.concat(newSelectedFile)
  }
}

/**
 * Triggers a separate upload for each file. Only uploads files that haven't been successfully uploaded before.
 * @return {void} void
 */
async function uploadFiles() {
  const doneStatus = i18n.global.t('files.status_done')
  const url = `${props.url}${props.target}`
  for (const file of selectedFiles.value) {
    if (file.status !== doneStatus) {
      file.status = i18n.global.t('files.status_loading')
      const res: AxiosResponse = await uploadFile(file.content, url, props.queryName)
      if (res.status === 201) {
        file.status = doneStatus
      }
      else {
        file.status = i18n.global.t('files.status_failed')
      }
    }
  }
  // Check for successful uploads
  const successfulUploads = selectedFiles.value.filter((file) => file.status === doneStatus)
  if (successfulUploads.length > 0) {
    onSuccess(successfulUploads)
  }

  // Check for failed uploads
  const failedUploads = selectedFiles.value.filter((file) => file.status === i18n.global.t('files.status_failed'))
  if (failedUploads.length > 0) {
    onFailed(failedUploads)
  }
}
</script>

<style scoped>

</style>
