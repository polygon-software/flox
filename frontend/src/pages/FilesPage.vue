<template>
  <div class="row justify-between items-center">
    <h4>Alias</h4>
    <q-btn
      color="primary"
      label="Upload File"
      icon-right="file_upload"
      no-caps
      @click="openCreateDialog"
    />
  </div>
  <FilesTable private />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

import FilesTable from 'src/flox/modules/file/components/tables/FilesTable.vue';
import FileUploadDialog from 'src/flox/modules/file/components/dialogs/FileUploadDialog.vue';

const $q = useQuasar();

function openCreateDialog(): void {
  $q.dialog({
    component: FileUploadDialog,

    // props forwarded to your custom component
    componentProps: {
      text: 'something',
      // ...more..props...
    },
  }).onOk(() => {});
}
</script>

<style scoped></style>
