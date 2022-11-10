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
    <div class="row">
      <q-btn
        v-if="!!fileBeingMoved"
        unelevated
        rounded
        outline
        label="Cancel movement"
        class="q-mr-sm"
        icon-right="close"
        no-caps
        @click="fileBeingMoved = null"
      />
      <q-btn
        v-if="!!fileBeingMoved"
        unelevated
        rounded
        color="primary"
        label="Move here"
        class="q-mr-sm"
        icon-right="drive_file_move_outline"
        no-caps
        @click="moveFileToPath"
      />
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
          :style="{
            opacity: !!fileBeingMoved && props.row.type === 'file' ? 0.5 : 1,
          }"
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
            <template
              v-if="
                fileBeingRenamed && props.row.uuid === fileBeingRenamed.uuid
              "
            >
              <OnClickOutside @trigger="fileBeingRenamed = null">
                <q-input
                  v-model="newFileName"
                  :suffix="fileNameSuffix"
                  autofocus
                  filled
                  dense
                  @click.stop.prevent
                  @keyup.enter="renameFile"
                />
              </OnClickOutside>
            </template>
            <template v-else>
              {{ props.row.name }}
            </template>
          </q-td>
          <q-td key="updatedAt" :props="props">
            {{
              props.row.updatedAt
                ? format(new Date(props.row.updatedAt), 'dd.MM.yyyy')
                : ''
            }}
          </q-td>
          <q-td key="size" :props="props">
            {{ formatBytes(props.row.size) }}
          </q-td>
          <q-td key="options" :props="props">
            <q-btn
              v-if="props.row.type === 'file'"
              :disable="!!fileBeingMoved"
              flat
              square
              color="grey"
              icon="more_vert"
              @click.stop
            >
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item
                    v-close-popup
                    clickable
                    @click.stop="removeFile(props.row.uuid)"
                  >
                    <q-item-section>Delete</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="delete" color="grey" size="large" />
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-close-popup
                    clickable
                    @click.stop="startMovingFile(props.row)"
                  >
                    <q-item-section>Move</q-item-section>
                    <q-item-section avatar>
                      <q-icon
                        name="drive_file_move_outline"
                        color="grey"
                        size="large"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-close-popup
                    clickable
                    @click.stop="startFileRenaming(props.row)"
                  >
                    <q-item-section> Rename </q-item-section>
                    <q-item-section avatar>
                      <q-icon
                        name="drive_file_rename_outline"
                        color="grey"
                        size="large"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-close-popup
                    clickable
                    @click="openAccessControlGroupPopup(props.row.uuid)"
                  >
                    <q-item-section>Access Rights</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="lock" color="grey" size="large" />
                    </q-item-section>
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
import { OnClickOutside } from '@vueuse/components';

import {
  deleteFile,
  getAllFiles,
  getFile,
  getFileReadAccessUserGroups,
  getFileWriteAccessUserGroups,
  getFolders,
  manipulateFileAccessUserGroups,
  searchFiles,
  updateFile,
} from 'src/flox/modules/file/services/file.service';
import { FileEntity } from 'src/flox/modules/file/entities/file.entity';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';
import { i18n } from 'boot/i18n';
import FolderEntity from 'src/flox/modules/file/entities/folder.entity';
import { ColumnInterface } from 'components/tables/useDataTable';
import ManageItemAccessControlGroups from 'src/flox/modules/access-control/components/dialogs/ManageItemAccessControlGroupsDialog.vue';

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
  if (props.path === '/') {
    emit('update:path', `${props.path}${folderName}`);
  } else {
    emit('update:path', `${props.path}/${folderName}`);
  }
}
function stripPathTo(index: number): void {
  emit('update:path', `/${pathSegments.value.slice(0, index + 1).join('/')}`);
}
function setPathToRoot(): void {
  emit('update:path', '/');
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

async function clickRow(row: FileOrFolder) {
  if (row.type === 'folder') {
    extendPath(row.name);
  } else {
    if (fileBeingMoved.value) {
      return;
    }
    const fileDetails = await getFile(row.uuid);
    if (fileDetails.url) {
      window.open(fileDetails.url, '_blank');
    }
  }
}

async function openAccessControlGroupPopup(uuid: string) {
  const readAccess = await getFileReadAccessUserGroups(uuid);
  const writeAccess = await getFileWriteAccessUserGroups(uuid);
  console.log({ readAccess, writeAccess });
  $q.dialog({
    component: ManageItemAccessControlGroups,
    componentProps: {
      readAccess,
      writeAccess,
    },
  }).onOk(
    ({
      addReadAccess = [],
      removeReadAccess = [],
      addWriteAccess = [],
      removeWriteAccess = [],
    }: {
      addReadAccess: string[];
      removeReadAccess: string[];
      addWriteAccess: string[];
      removeWriteAccess: string[];
    }) => {
      manipulateFileAccessUserGroups(uuid, {
        addReadAccess,
        removeReadAccess,
        addWriteAccess,
        removeWriteAccess,
      })
        .then(async (): Promise<void> => {
          showSuccessNotification($q, 'Access rights edited');
          await refresh();
        })
        .catch((e: any) => {
          console.error(e);
          showErrorNotification($q, 'Access rights update failed');
        });
    }
  );
}

const files: Ref<FileEntity[]> = ref([]);
const folders: Ref<FolderEntity[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const fileBeingMoved: Ref<FileEntity | null> = ref(null);
const fileBeingRenamed: Ref<FileEntity | null> = ref(null);
const newFileName: Ref<string> = ref('');
const fileNameSuffix: ComputedRef<string> = computed(() => {
  if (!fileBeingRenamed.value) {
    return '';
  }
  const name = fileBeingRenamed.value.filename;
  return name.substr(name?.lastIndexOf('.'));
});

type FileOrFolder = {
  uuid: string;
  type: 'file' | 'folder';
  name: string;
  size: number;
  files?: number;
  mimetype?: string;
  createdAt?: Date;
  updatedAt?: Date;
  url?: string;
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
    name: 'updatedAt',
    required: true,
    align: 'left',
    label: 'Last Updated',
    field: 'updatedAt',
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
  const [newFolders, newFiles] = await Promise.all([
    getFolders(props.path),
    getAllFiles(100, 0, props.path, 360),
  ]);
  folders.value = newFolders;
  files.value = newFiles;
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

async function removeFile(uuid: string): Promise<void> {
  await deleteFile(uuid);
  showSuccessNotification(
    $q,
    i18n.global.t('files.successfully_deleted', { value: 1 })
  );
  await refresh();
}
function startMovingFile(file: FileEntity): void {
  fileBeingMoved.value = file;
}
async function moveFileToPath(): Promise<void> {
  if (fileBeingMoved.value) {
    await updateFile(
      fileBeingMoved.value.uuid,
      fileBeingMoved.value.filename,
      props.path
    );
    fileBeingMoved.value = null;
  }
  await refresh();
}
function startFileRenaming(file: FileEntity): void {
  newFileName.value = file.filename.substring(0, file.filename.indexOf('.'));
  fileBeingRenamed.value = file;
}
async function renameFile(): Promise<void> {
  if (fileBeingRenamed.value) {
    await updateFile(
      fileBeingRenamed.value.uuid,
      newFileName.value + fileNameSuffix.value,
      fileBeingRenamed.value.path
    );
    fileBeingRenamed.value = null;
    newFileName.value = '';
  }
  await refresh();
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
