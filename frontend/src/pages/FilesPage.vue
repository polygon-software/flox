<template>
  <div class="row justify-between items-center">
    <h4>Alias</h4>
    <div class="row">
      <q-btn
        v-if="!folderCreation"
        unelevated
        outline
        color="primary"
        label="Create Folder"
        class="q-mr-sm"
        icon-right="create_new_folder"
        no-caps
        style="width: 200px"
        @click="folderCreation = true"
      />
      <OnClickOutside v-else @trigger="folderCreation = false">
        <q-input
          v-model="folderName"
          outlined
          autofocus
          dense
          label="Folder Name"
          class="q-mr-sm"
          color="primary"
          icon-right="create_new_folder"
          style="width: 200px"
          @keyup.enter="createFolder"
        >
          <template #append>
            <q-icon name="create_new_folder" color="primary" />
          </template>
        </q-input>
      </OnClickOutside>
      <q-btn
        unelevated
        color="primary"
        label="Upload File"
        icon-right="file_upload"
        no-caps
        @click="openCreateDialog"
      />
    </div>
  </div>
  <FileExplorer ref="fileExplorerRef" v-model:path="path" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, Ref } from 'vue';
import { OnClickOutside } from '@vueuse/components';

import FileUploadDialog from 'src/flox/modules/file/components/dialogs/FileUploadDialog.vue';
import FileExplorer from 'src/flox/modules/file/components/tables/FileExplorer.vue';

const $q = useQuasar();

const path: Ref<string> = ref('');
const folderCreation: Ref<boolean> = ref(false);
const folderName: Ref<string> = ref('');
const fileExplorerRef: Ref<InstanceType<typeof FileExplorer> | null> =
  ref(null);

function createFolder(): void {
  path.value = `${path.value}/${folderName.value}`;
  folderName.value = '';
}

function openCreateDialog(): void {
  $q.dialog({
    component: FileUploadDialog,

    // props forwarded to your custom component
    componentProps: {
      acceptedFiles: '*/*',
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
