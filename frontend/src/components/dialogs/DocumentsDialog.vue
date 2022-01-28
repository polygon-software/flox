<template>
  <q-dialog
    ref="dialog"
    :title="$t('employee_dashboard.all_documents')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <h6 class="q-ma-sm">
          {{ $t('employee_dashboard.all_documents') }}
        </h6>
        <q-list
          bordered
          separator
        >
          <!-- A single document (highlighted if it's a dossier's final summary document) -->
          <q-item
            v-for="(file) in props.files"
            :key="file.uuid"
            :style="file.key.substring(37) === finalDocumentName && uploadEnabled ? 'background: rgba(253, 216, 53, 0.4)' : ''"
          >
            <q-item-section>
              <div class="row flex justify-between content-center" style="height: 50px">
                <div class="column">
                  <!-- File name -->
                  <q-item-label>
                    {{ getFileName(file.key) }}
                  </q-item-label>
                  <!-- File type -->
                  <q-item-label v-if="file.file_type !== DOSSIER_FILE_TYPE.NONE" caption>
                    {{ $t(`file_type_enum.${file.file_type}`) }}
                  </q-item-label>
                </div>
                <q-btn
                  color="primary"
                  icon="download"
                  round
                  @click="openFile(file.uuid)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.close')"
          color="primary"
          flat
          @click="onCancel"
        />

        <q-btn
          v-if="uploadEnabled"
          class="q-ma-md"
          :label="$t('buttons.upload_documents')"
          icon="upload"
          color="primary"
          @click="onUpload"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref, Ref} from 'vue';
import {QDialog, openURL} from 'quasar';
import { executeQuery} from 'src/helpers/data-helpers';
import {PRIVATE_FILE} from 'src/data/queries/FILE';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';
import {i18n} from 'boot/i18n';
import {DOSSIER_FILE_TYPE} from '../../../definitions/ENUMS';

/**
 * A dialog for showing a list of downloadable files, and (optionally) to allow uploading new files to the given entity
 */

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)
const emit = defineEmits(['ok'])

const props = defineProps({
  files: {
    type: Array,
    required: true
  },
  dossierUuid: {
    type: String,
    required: false,
    default: null
  },
  query: {
    type: Object,
    required: false,
    default: PRIVATE_FILE
  },
  uploadEnabled: {
    type: Boolean,
    required: false,
    default: false,
  }
})

// Name of dossier's final document (used to prettify in template)
const finalDocumentName = props.dossierUuid ? `Dossier_${props.dossierUuid}.pdf`: ''

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}
// eslint-disable-next-line require-jsdoc
function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}


/**
 * Fetches and opens a file
 * @param {string} fileUuid - uuid of file
 * @returns {Promise<void>} - done
 */
async function openFile(fileUuid: string): Promise<void> {
  const query = props.query as QueryObject
  const queryRes = await executeQuery(query, {uuid: fileUuid})
  const file = queryRes.data[query.cacheLocation] as Record<string, unknown>
  openURL(file.url as string)
}

// eslint-disable-next-line require-jsdoc
function onCancel() {
  hide()
}

/**
 * On upload button click, hide & emit 'ok'
 * @returns {void}
 */
function onUpload() {
  emit('ok')
  hide();
}

/**
 * Returns the display file name for a given file key
 * @param {string} key - PrivateFile's key (UUID followed by filename)
 * @returns {string} - file to show
 */
function getFileName(key: string){
  const maxLength = 32 // Maximum name length, excluding suffix
  let shortName = key.substring(37)

  // Shorten, if needed
  if(shortName.length > maxLength && shortName != finalDocumentName){
    shortName = shortName.substring(0, maxLength) + '[...].pdf'
  }
  return shortName === finalDocumentName ? i18n.global.t('documents.final_document') + '.pdf' : shortName
}
</script>
