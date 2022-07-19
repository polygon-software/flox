<template>
  <ExtendedUploader
    :multiple="props.multiple"
    :label="$t('files.upload')"
    :url="props.url"
    @rejected="onRejected"
    @failed="onFailed"
    :autoUpload="props.autoUpload"
    :hide-upload-button="props.hideUploadButton"
    :max-file-size="props.maxFileSize"
    :max-total-size="props.maxTotalSize"
    :max-files="props.maxFiles"
    :accept="props.acceptedFiles"
    :send-raw="props.sendRaw"
    :batch="props.batch"
  >
    <template v-slot:list="scope">
      <q-list separator>

        <q-item v-for="file in scope.files" :key="file.name">
          <q-item-section
            class="q-ml-none">
            <q-item-label>
              {{ file.name }}
            </q-item-label>

            <q-item-label caption>
              Status: {{ file.__status }}
            </q-item-label>

            <q-item-label caption>
              {{ file.__sizeLabel }} / {{ file.__progressLabel }}
            </q-item-label>
          </q-item-section>

          <q-item-section
            v-if="file.__img"
            thumbnail
          >
            <img :src=" file.__img.src" alt="thumbnail of added file">
          </q-item-section>

          <q-item-section top side>
            <q-btn
              class="gt-xs"
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click="scope.removeFile(file)"
            ></q-btn>
          </q-item-section>
        </q-item>

      </q-list>
    </template>
  </ExtendedUploader>
</template>

<script setup lang="ts">
import {
  QVueGlobals,
  useQuasar,
} from 'quasar';
import ExtendedUploader from 'src/flox/modules/auth/components/forms/fields/ExtendedUploader';
import {defineProps} from 'vue';

const $q: QVueGlobals = useQuasar()

const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 5e7
  },
  maxTotalSize: {
    type: Number,
    default: 5e7
  },
  maxFiles: {
    type: Number,
    default: 10
  },
  multiple: {
    type: Boolean,
    default: true
  },
  autoUpload: {
    type: Boolean,
    default: false
  },
  hideUploadButton: {
    type: Boolean,
    default: false
  },
  acceptedFiles: {
    type: String,
    default: '.jpg, .pdf, image/*'
  },
  sendRaw: {
    type: Boolean,
    default: true
  },
  batch: {
    type: Boolean,
    default: true
  },
  url: {
    type: String,
    default: ''
  }
})
/**
 * reject
 * @param {any} rejectedEntries - rej
 * @return {none} none
 */
function onRejected (rejectedEntries: Array<any>) {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`
  })
}

/**
 * failed
 * @param {any} failedEntries - failed
 * @return {void} void
 */
function onFailed (failedEntries: Array<Array<File>|any>) {
  $q.notify({
    type: 'negative',
    message: `${failedEntries.files.length} file(s) could not be uploaded`
  })
}

</script>

<style scoped>

</style>
