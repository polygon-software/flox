<template>
  <div class="row justify-between items-center">
    <div>
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
    </div>
    <div>
      <q-input
        v-model="searchInput"
        label="Search Files"
        rounded
        outlined
        dense
      />
    </div>
  </div>
  <q-card class="q-pa-md q-mt-lg" flat bordered>
    <q-table
      flat
      hide-bottom
      :loading="loading"
      :rows="filesAndFolders"
      :columns="columns"
      row-key="uuid"
      :pagination="initialPagination"
    >
      <template #body="props">
        <q-tr
          :props="props"
          :class="{
            fileRow: props.row.type === 'file',
            folderRow: props.row.type === 'folder',
          }"
          class="cursor-pointer"
          @click="clickRow(props.row)"
        >
          <q-td key="mimetype" :props="props">
            <div class="relative-position" style="text-align: center">
              <q-icon
                :name="mimetypeToIcon(props.row.mimetype)"
                color="primary"
                :style="{ opacity: props.row.type === 'folder' ? 1 : 0.7 }"
                :size="props.row.type === 'folder' ? '32px' : '24px'"
              />
              <span
                v-if="props.row.type === 'folder'"
                class="absolute-left text-white n-files"
              >
                {{ props.row.files }}
              </span>
            </div>
          </q-td>
          <q-td key="name" :props="props" style="font-weight: 500">
            {{ props.row.name }}
          </q-td>
          <q-td key="createdAt" :props="props">
            {{
              props.row.createdAt
                ? format(new Date(props.row.createdAt), 'dd.MM.yyyy')
                : ''
            }}
          </q-td>
          <q-td key="size" :props="props">
            {{ formatBytes(props.row.size) }}
          </q-td>
          <q-td key="options" :props="props">
            <q-btn flat square color="grey" icon="more_vert">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item v-close-popup clickable>
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                  <q-item v-close-popup clickable>
                    <q-item-section>Rename</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref, Ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';

import {
  deleteFile,
  getAllFiles,
  getFolders,
  searchFiles,
} from 'src/flox/modules/file/services/file.service';
import { FileEntity } from 'src/flox/modules/file/entities/file.entity';
import { showSuccessNotification } from 'src/tools/notification.tool';
import { i18n } from 'boot/i18n';
import FolderEntity from 'src/flox/modules/file/entities/folder.entity';
import { ColumnInterface } from 'components/tables/useDataTable';

const $q = useQuasar();

const props = defineProps<{
  path: string;
}>();

const emit = defineEmits<{
  (e: 'update:path', path: string): void;
}>();

const searchInput: Ref<string> = ref('');

const initialPagination = {
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 500,
};

const pathSegments: ComputedRef<string[]> = computed(() => {
  return props.path.substring(1).split('/');
});

function extendPath(folderName: string): void {
  emit('update:path', `${props.path}/${folderName}`);
}
function stripPathTo(index: number): void {
  emit('update:path', `/${pathSegments.value.slice(0, index + 1).join('/')}`);
}
function setPathToRoot(): void {
  emit('update:path', '');
}
watch(searchInput, async () => {
  await debounceSearch();
});

function mimetypeToIcon(mimetype: string) {
  if (!mimetype) {
    return 'folder';
  }
  if (mimetype.startsWith('image')) {
    return 'image';
  }
  if (mimetype.startsWith('audio')) {
    return 'library_music';
  }
  if (mimetype.startsWith('video')) {
    return 'videocam';
  }
  if (mimetype.startsWith('text')) {
    return 'text_fields';
  }
  return 'attach_file';
}

function formatBytes(bytes: number) {
  const decimals = 1;
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function clickRow(row: FileOrFolder) {
  if (row.type === 'folder') {
    extendPath(row.name);
  }
}

const files: Ref<FileEntity[]> = ref([]);
const folders: Ref<FolderEntity[]> = ref([]);
const selected: Ref<FileEntity[]> = ref([]);
const loading: Ref<boolean> = ref(false);

type FileOrFolder = {
  type: 'file' | 'folder';
  name: string;
  size: number;
  files?: number;
  mimetype?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
const filesAndFolders: ComputedRef<FileOrFolder[]> = computed(() => {
  const joint: FileOrFolder[] = [];
  files.value.forEach((file) => {
    joint.push({
      type: 'file',
      name: file.filename,
      ...file,
    });
  });
  folders.value.forEach((folder) => {
    joint.push({
      type: 'folder',
      ...folder,
    });
  });
  return joint;
});

function fileFolderSort(
  val1: any,
  val2: any,
  a: FileOrFolder,
  b: FileOrFolder
): number {
  if (a.type === 'file' && b.type === 'folder') {
    return 1;
  }
  if (a.type === 'folder' && b.type === 'file') {
    return -1;
  }
  if (val1 === val2) {
    return 0;
  }
  return val1 < val2 ? -1 : 1;
}

const columns: ColumnInterface<File | FolderEntity> = [
  {
    name: 'mimetype',
    key: 'mimetype',
    required: true,
    align: 'left',
    label: '',
    field: 'mimetype',
    sortable: false,
    style: 'width: 50px',
  },
  {
    name: 'name',
    required: true,
    align: 'left',
    label: 'Name',
    field: 'name',
    sortable: true,
    sort: fileFolderSort,
  },
  {
    name: 'createdAt',
    required: true,
    align: 'left',
    label: 'Created',
    field: 'createdAt',
    sortable: true,
    sort: fileFolderSort,
  },
  {
    name: 'size',
    required: true,
    label: 'Size',
    field: 'size',
    sortable: true,
    sort: fileFolderSort,
  },
  {
    name: 'options',
    label: '',
    field: 'options',
  },
];

async function fetchFiles(): Promise<void> {
  files.value = await getAllFiles(100, 0, props.path, 360);
}
async function fetchFolders(): Promise<void> {
  folders.value = await getFolders(props.path);
}
async function searchForFiles(): Promise<void> {
  const { count, data } = await searchFiles(
    100,
    0,
    searchInput.value,
    'filename',
    false,
    360
  );
  files.value = data;
}
const debounceSearch = debounce<typeof searchForFiles>(searchForFiles, 250, {
  leading: false,
  trailing: true,
});

async function refresh(): Promise<void> {
  searchInput.value = '';
  loading.value = true;
  await Promise.all([fetchFolders(), fetchFiles()]);
  loading.value = false;
}

watch(
  () => props.path,
  async () => {
    await refresh();
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

<style scoped>
.n-files {
  left: 5px;
  top: 9px;
  font-size: 0.7rem;
  width: 22px;
  text-align: center;
  opacity: 0.75;
  font-weight: 600;
}
</style>
