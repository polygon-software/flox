<template>
  <q-dialog
    ref="dialog"
    :title="$t('employee_dashboard.all_documents')"
  >
    <q-card style="width: 600px;">
      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item v-ripple>
            <q-item-section >
              <div class="row flex content-center">
                <p class="col-5">{{ $t('employee_dashboard.all_documents') }}:</p>
                <p class="col-7">todo show all documents</p>
              </div>
            </q-item-section>
          </q-item>

        </q-list>
      </q-card-section>
      <q-card-actions>
<!--        todo: improve the file uploader -->
<!--        <q-uploader-->
<!--          flat-->
<!--          :label="$t('employee_dashboard.upload_more_documents')"-->
<!--          color="primary"-->
<!--        />-->
        <q-btn
          class="q-ma-md"
          :label="$t('employee_dashboard.upload_more_documents')"
          color="primary"
          @click="onOk"
        />
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
  <q-dialog
    v-model="showDialog"
    >
    <q-card-section>
      <q-file
        model-value="file"
        class="q-mb-md"
        outlined
        accept="image/*, .pdf"
        label="click again here"
        stack-label
        clearable
        @update:model-value="upload"
      />
    </q-card-section>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref, Ref} from "vue";
import {QDialog} from "quasar";

const dialog: Ref<QDialog|null> = ref<QDialog|null>(null)

let showDialog = ref(false)

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
  showDialog.value = false
}

/**
 * Upload further documents
 */
function onOk(): void {
  showDialog.value = true
}

function onCancel(): void {
  hide()
}

</script>
