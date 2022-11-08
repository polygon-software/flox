<template>
  <q-breadcrumbs>
    <q-breadcrumbs-el
      label="Home"
      icon="home"
      class="cursor-pointer"
      @click="setPathToRoot"
    />
    <q-breadcrumbs-el
      v-for="(segment, index) in pathSegments"
      :key="segment + index"
      :label="segment"
      class="cursor-pointer"
      @click="stripPathTo(index)"
    />
  </q-breadcrumbs>
  <p v-for="file in files" :key="file.uuid">
    {{ file.filename }}
  </p>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref, Ref, watch } from 'vue';
import { useQuasar } from 'quasar';

import {
  deleteFile,
  getAllFiles,
} from 'src/flox/modules/file/services/file.service';
import { FileEntity } from 'src/flox/modules/file/entities/file.entity';
import { showSuccessNotification } from 'src/tools/notification.tool';
import { i18n } from 'boot/i18n';

const $q = useQuasar();

const props = defineProps<{
  path: string;
}>();

const emit = defineEmits<{
  (e: 'update:path', path: string): void;
}>();

const pathSegments: ComputedRef<string[]> = computed(() => {
  return props.path.substring(1).split('/');
});

function stripPathTo(index: number): void {
  emit('update:path', `/${pathSegments.value.slice(0, index + 1).join('/')}`);
}
function setPathToRoot(): void {
  emit('update:path', '/');
}

const files: Ref<FileEntity[]> = ref([]);
const selected: Ref<FileEntity[]> = ref([]);

async function fetchFiles(): Promise<void> {
  files.value = await getAllFiles(100, 0, props.path, 360);
}

async function refresh(): void {
  await fetchFiles();
}

watch(
  () => props.path,
  () => {
    fetchFiles();
  },
  {
    immediate: true,
  }
);

defineExpose({
  refresh,
});

async function deleteSelected(): Promise<void> {
  const selectedFile = selected.value[0];
  await deleteFile(selectedFile.uuid);
  selected.value = [];
  showSuccessNotification(
    $q,
    i18n.global.t('files.successfully_deleted', { value: 1 })
  );
}
</script>

<style scoped></style>
