<template>
  <div class="row justify-between items-center">
    <h4>{{ $t('files.files') }}</h4>
    <div class="row">
      <q-btn
        v-if="!inFolderCreationMode"
        unelevated
        outline
        color="primary"
        :label="$t('files.create_folder')"
        class="q-mr-sm"
        icon-right="create_new_folder"
        no-caps
        style="width: 200px"
        @click="inFolderCreationMode = true"
      />
      <OnClickOutside v-else @trigger="inFolderCreationMode = false">
        <q-input
          v-model="newFolderNameInput"
          outlined
          autofocus
          dense
          :label="$t('files.folder_name')"
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
        :label="$t('files.upload')"
        icon-right="file_upload"
        no-caps
        @click="openFileUploadDialog"
      />
    </div>
  </div>
  <FileExplorer ref="fileExplorerRef" v-model:path="path" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed, inject, ref, Ref, WritableComputedRef } from 'vue';
import { OnClickOutside } from '@vueuse/components';

import FileUploadDialog from 'src/flox/modules/file/components/dialogs/FileUploadDialog.vue';
import FileExplorer from 'src/flox/modules/file/components/tables/FileExplorer.vue';
import RouterService from 'src/services/RouterService';

const $q = useQuasar();

const inFolderCreationMode: Ref<boolean> = ref(false);
const newFolderNameInput: Ref<string> = ref('');
const fileExplorerRef: Ref<InstanceType<typeof FileExplorer> | null> =
  ref(null);

const $routerService: RouterService | undefined = inject('$routerService');

const path: WritableComputedRef<string> = computed({
  get(): string {
    return $routerService?.getQueryParam('path') ?? '/';
  },
  set(value: string) {
    void $routerService?.pushToQuery({
      path: value,
    });
  },
});

/**
 * Creates a new folder in the frontend only. A folder is only active in the backend when a file exists within it.
 */
function createFolder(): void {
  if (path.value === '/') {
    path.value = `/${newFolderNameInput.value}`;
  } else {
    path.value = `${path.value}/${newFolderNameInput.value}`;
  }
  newFolderNameInput.value = '';
}

/**
 * Opens the file upload dialog and refreshes the explorer on close
 */
function openFileUploadDialog(): void {
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      fileExplorerRef.value.refresh();
    }
  });
}
</script>
