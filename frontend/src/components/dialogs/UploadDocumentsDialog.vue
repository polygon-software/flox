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
            v-for="(file, index) in props.entity.documents"
            :key="file.uuid"
          >
            <q-item-section>
              <div class="row flex justify-between content-center" style="height: 50px">
                <p class="col-8">{{ file.key.substring(32) }}</p>
                <q-btn
                  style="margin-left: 12px"
                  color="primary"
                  icon="download"
                  @click="loadFile(file)"
                />
                <q-btn
                  style="margin-left: 12px"
                  color="primary"
                  icon="delete"
                  @click="remove(index)"
                />
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
import {ref, Ref} from 'vue';
import {QDialog, openURL} from 'quasar';
import {uploadFiles} from 'src/helpers/file-helpers';
import {executeMutation, executeQuery} from 'src/helpers/data-helpers';
import {PRIVATE_FILE} from 'src/data/queries/QUERIES';

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const files = ref([]) as Ref<Array<File>>

const props = defineProps({
  entity: {
    required: true,
    type: Object
  }
})

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
 * @returns {void}
 */
async function upload(): Promise<void> {
  const dossier = props.entity as Record<string, string>
  const reformatted:Record<string, File> = {}
  files.value.forEach((file)=>{
    reformatted[file.name] = file
  })
  await uploadFiles(reformatted, `/uploadDossierFile?did=${dossier.uuid}`, 'getMyDossiers')

}

/**
 * After clicking on the delete icon, removes the file
 * @param {number} index - index number of the file which should be removed
 * @returns {void}
 */
function remove(index: number) {
  console.log(index)
}

/**
 * open File based on URL
 * @param {Record<string, string>} file - file to open
 * @returns {Promise<void>} - done
 */
async function loadFile(file: Record<string, string>) {
  const queryResult = await executeQuery(PRIVATE_FILE, {uuid: file.uuid})
  const loadedFile = queryResult.data[PRIVATE_FILE.cacheLocation] as Record<string, string>
  openURL(loadedFile.url)
}

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}

</script>
