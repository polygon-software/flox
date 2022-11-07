<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Create new Access Group</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section>
        <FileUpload :accepted-files="'image/*, .pdf'" />
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Close"
          icon-right="add"
          @click="onOKClick"
        />
        <q-btn label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

import FileUpload from 'src/flox/modules/file/components/forms/fields/FileUpload.vue';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

async function onOKClick() {
  onDialogOK();
}
</script>

<style scoped></style>
