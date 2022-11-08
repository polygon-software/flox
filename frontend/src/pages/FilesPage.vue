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
  <FileExplorer ref="fileExplorerRef" v-model:path="path" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, Ref } from 'vue';

import FileUploadDialog from 'src/flox/modules/file/components/dialogs/FileUploadDialog.vue';
import FileExplorer from 'src/flox/modules/file/components/tables/FileExplorer.vue';

const $q = useQuasar();

const path: Ref<string> = ref('/bla/blu/as/sdf');
const fileExplorerRef: Ref<InstanceType<typeof FileExplorer> | null> =
  ref(null);

function openCreateDialog(): void {
  $q.dialog({
    component: FileUploadDialog,

    // props forwarded to your custom component
    componentProps: {
      acceptedFiles: 'image/*',
      multiple: true,
      path,
    },
  }).onOk(() => {
    if (fileExplorerRef.value) {
      fileExplorerRef.value.refresh();
    }
  });
}
</script>

<style scoped></style>
