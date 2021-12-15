<template>
  <q-dialog
    ref="dialog"
    :title="$t('employee_dashboard.all_documents')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <p>
          {{ $t('employee_dashboard.all_documents') }}
        </p>
        <q-list
          bordered
          separator
        >
          <q-item
            v-for="(file, index) in existingFiles"
            :key="file.uuid"
          >
            <q-item-section>
              <div class="row flex justify-between content-center" style="height: 50px">
                <p class="col-8">{{ file.key }}</p>
                <div
                  v-if="file.url"
                  class="col-4"
                >
                  <q-btn
                    style="margin-left: 12px"
                    color="primary"
                    icon="download"
                    @click="openURL(file.url)"
                  />
                  <q-btn
                    style="margin-left: 12px"
                    color="primary"
                    icon="delete"
                    @click="remove(index)"
                  />
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section>
        <div>
          <q-file
            v-model="files"
            class="q-mb-md"
            outlined
            accept="image/*, .pdf"
            :label="$t('employee_dashboard.upload_more_documents')"
            stack-label
            clearable
            use-chips
            multiple
            append
          />
          <q-btn
            v-if="files.length !== 0"
            class="q-ma-md"
            :label="$t('status.uploading')"
            color="primary"
            flat
            disable
            @click="upload"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          class="q-ma-md"
          :label="$t('buttons.cancel')"
          color="primary"
          flat
          @click="onCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref, Ref} from "vue";
import {QDialog, openURL} from "quasar";

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const files = ref([])

//remove this and take the existing files form the backend from dossier table
const existingFiles = ref([
  {key: 'Beispiel1', uuid: 1, url: 'https://link.springer.com/content/pdf/10.1007/s11576-008-0095-0.pdf'},
  {key: 'Beispiel2', uuid: 2, url: 'https://link.springer.com/content/pdf/10.1007/s00287-006-0063-2.pdf'},
  {key: 'Beispiel3', uuid: 3, url: 'https://sisis.rz.htw-berlin.de/inh2009/12372030.pdf'},
  {key: 'Beispiel4', uuid: 4, url: 'https://cds.cern.ch/record/798228/files/0131456601_TOC.pdf'},
])

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
 * Uploads the selected files from the desktop to the existing files
 * for now it is a placeholder function
 * @returns {void}
 */
function upload(): void {
  if (files.value.length !== 0) {
    for (const i of files.value) {
      if (existingFiles.value.indexOf(files.value[i]) === -1) {
        existingFiles.value.push(files.value[i])
      }
    }
  }
}

/**
 * After clicking on the delete icon, removes the file
 * @param {number} index - index number of the file which should be removed
 * @returns {void}
 */
function remove(index: number) {
  existingFiles.value.splice(index, 1)
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}

</script>
