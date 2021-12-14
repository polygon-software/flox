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
            v-for="(file, index) in existing_files"
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
import {QDialog} from "quasar";
import {openURL} from 'quasar';

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const files = ref([])

//todo: take the existing files form the backend from dossier table
const existing_files = ref([
  {key: 'Beispiel1', uuid: 1, url: 'https://link.springer.com/content/pdf/10.1007/s00287-006-0063-2.pdf'},
  {key: 'Beispiel2', uuid: 2, url: 'https://link.springer.com/content/pdf/10.1007/s00287-006-0063-2.pdf'},
  {key: 'Beispiel3', uuid: 3, url: 'https://link.springer.com/content/pdf/10.1007/s00287-006-0063-2.pdf'},
  {key: 'Beispiel4', uuid: 4, url: 'https://link.springer.com/content/pdf/10.1007/s00287-006-0063-2.pdf'},
])

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function show(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.show();
}

function hide(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

//todo: implement upload which uploads the selected file and shows it
function upload(): void {
  if (files.value.length !== 0)
  for (let i=0; i < (files.value.length); i++) {
    if (existing_files.value.indexOf(files.value[i]) == -1)
    existing_files.value.push(files.value[i])
  }
}

/**
 * after clicking on the delete icon, removes the file
 */
function remove(index: number) {
  existing_files.value.splice(index, 1)
}


function onCancel(): void {
  hide()
}

</script>
