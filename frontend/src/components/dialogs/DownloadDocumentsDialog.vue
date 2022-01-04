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
            v-for="(file) in props.files"
            :key="file.uuid"
          >
            <q-item-section>
              <div class="row flex justify-between content-center" style="height: 50px">
                <p class="col-8">{{ file.key.substring(37) }}</p>
                <q-btn
                  color="primary"
                  icon="download"
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
          :label="$t('buttons.ok')"
          color="primary"
          @click="onCancel"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref, Ref} from 'vue';
import {QDialog, openURL} from 'quasar';
import {executeQuery} from 'src/helpers/data-helpers';
import {PRIVATE_FILE} from 'src/data/queries/QUERIES';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

const props = defineProps({
  files: {
    type: Array,
    required: true
  },
  query: {
    type: Object,
    required: false,
    default: PRIVATE_FILE
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

// eslint-disable-next-line require-jsdoc
function onCancel(): void {
  hide()
}

/**
 * fetches and opens a file
 * @param {string} fileUuid - uuid of file
 * @returns {Promise<void>} - done
 */
async function openFile(fileUuid: string): Promise<void> {
  const query = props.query as QueryObject
  const queryRes = await executeQuery(query, {uuid: fileUuid})
  const file = queryRes.data[query.cacheLocation] as Record<string, unknown>
  openURL(file.url as string)
}

</script>
