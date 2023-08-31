<template>
  <div class="row justify-between items-center">
    <div>
      <q-breadcrumbs>
        <q-breadcrumbs-el
          :label="$t('files.root')"
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
      :loading="isLoading"
      :rows="filesAndFolders"
      :columns="fileOrFolderColumns"
      row-key="uuid"
      :pagination="initialPagination"
    >
      <template #body="bodyProps">
        <q-tr
          :props="bodyProps"
          :class="{
            fileRow: bodyProps.row.type === 'file',
            folderRow: bodyProps.row.type === 'folder',
          }"
          class="cursor-pointer"
          :style="{
            opacity:
              !!fileBeingMoved && bodyProps.row.type === 'file' ? 0.5 : 1,
          }"
          @click="clickOnFileOrFolder(bodyProps.row)"
        >
          <q-td key="mimetype" :props="bodyProps">
            <div class="relative-position" style="text-align: center">
              <q-icon
                :name="mimetypeToIcon(bodyProps.row.mimetype)"
                color="primary"
                :style="{ opacity: bodyProps.row.type === 'folder' ? 1 : 0.7 }"
                :size="bodyProps.row.type === 'folder' ? '32px' : '24px'"
              />
              <span
                v-if="bodyProps.row.type === 'folder'"
                class="absolute-left text-white n-files"
              >
                {{ bodyProps.row.files }}
              </span>
            </div>
          </q-td>
          <q-td key="name" :props="bodyProps" style="font-weight: 500">
            <template
              v-if="
                fileBeingRenamed && bodyProps.row.uuid === fileBeingRenamed.uuid
              "
            >
              <OnClickOutside @trigger="fileBeingRenamed = null">
                <q-input
                  v-model="newFileNameInput"
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
              {{ bodyProps.row.name }}
            </template>
          </q-td>
          <q-td key="updatedAt" :props="bodyProps">
            {{
              bodyProps.row.updatedAt
                ? format(new Date(bodyProps.row.updatedAt), 'dd.MM.yyyy')
                : ''
            }}
          </q-td>
          <q-td key="size" :props="bodyProps">
            {{ formatBytes(bodyProps.row.size) }}
          </q-td>
          <q-td key="options" :props="bodyProps">
            <q-btn
              v-if="bodyProps.row.type === 'file'"
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
                    @click.stop="removeFile(bodyProps.row.uuid)"
                  >
                    <q-item-section>Delete</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="delete" color="grey" size="large" />
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-close-popup
                    clickable
                    @click.stop="startMovingFile(bodyProps.row)"
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
                    @click.stop="startFileRenaming(bodyProps.row)"
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
                  <AdminOnly>
                    <q-item
                      v-close-popup
                      clickable
                      @click="openAccessControlGroupDialog(bodyProps.row.uuid)"
                    >
                      <q-item-section>Access Rights</q-item-section>
                      <q-item-section avatar>
                        <q-icon name="lock" color="grey" size="large" />
                      </q-item-section>
                    </q-item>
                  </AdminOnly>
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

import { formatBytes } from 'src/format/number.format';
import {
  isAudio,
  isImage,
  isPdf,
  isVideo,
  mimetypeToIcon,
} from 'src/flox/modules/file/tools/mimetype.tools';
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
import FileEntity from 'src/flox/modules/file/entities/file.entity';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';
import { i18n } from 'boot/i18n';
import FolderEntity from 'src/flox/modules/file/entities/folder.entity';
import { ColumnAlign, ColumnInterface } from 'components/tables/useDataTable';
import ManageItemAccessControlGroups from 'src/flox/modules/access-control/components/dialogs/ManageItemAccessControlGroupsDialog.vue';
import AdminOnly from 'src/flox/modules/auth/components/roles/AdminOnly.vue';
import {
  previewAudio,
  previewImage,
  previewPdf,
  previewUnknownfile,
  previewVideo,
} from 'src/flox/modules/file/tools/preview.tools';

const props = defineProps<{
  path: string;
}>();

const emit = defineEmits<{
  (e: typeof EMIT_UPDATE_PATH, path: string): void;
}>();

const $q = useQuasar();

const EMIT_UPDATE_PATH = 'update:path';
type FileOrFolder = {
  uuid: string;
  type?: 'file' | 'folder';
  name?: string;
  size?: number;
  files?: number;
  mimetype?: string;
  createdAt?: Date;
  updatedAt?: Date;
  url?: string;
};

/**
 * Files and folders are updated whenever path is changed
 */
const files: Ref<FileEntity[]> = ref([]);
const folders: Ref<FolderEntity[]> = ref([]);
const isLoading: Ref<boolean> = ref(false);

/**
 * Users search input, used to search for file names indepenently of folder
 */
const searchInput: Ref<string> = ref('');

/**
 * Holds file being moved
 */
const fileBeingMoved: Ref<FileEntity | null> = ref(null);

/**
 * Handles renaming of files
 */
const fileBeingRenamed: Ref<FileEntity | null> = ref(null);
const newFileNameInput: Ref<string> = ref('');

/**
 * Refresh loads all new files and folders according to the current path
 */
async function refresh(): Promise<void> {
  searchInput.value = '';
  isLoading.value = true;
  const [newFolders, newFiles] = await Promise.all([
    getFolders(props.path),
    getAllFiles(100, 0, props.path, 360),
  ]);
  folders.value = newFolders;
  files.value = newFiles;
  isLoading.value = false;
}

/**
 * Whenever path changes, new files should be fetched
 * Apollo handles the caching of already fetched files already
 */
watch(
  () => props.path,
  () => {
    void refresh();
  },
  {
    immediate: true,
  }
);

/**
 * Computed is used to unite files and folders
 */
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

/**
 * Function that searches for files according to a user search input independently of current folder
 */
async function searchForFiles(): Promise<void> {
  if (searchInput.value === '') {
    await refresh();
  } else {
    isLoading.value = true;
    const { data } = await searchFiles(
      100,
      0,
      searchInput.value,
      'filename',
      false,
      360
    );
    files.value = data;
    folders.value = [];
    isLoading.value = false;
  }
}
const debounceSearch = debounce<typeof searchForFiles>(searchForFiles, 250, {
  leading: false,
  trailing: true,
});
/**
 * Search debauced when search input changes
 */
watch(searchInput, async () => {
  await debounceSearch();
});

/**
 * Extracts the suffix from the file that is renamed to ensure that the user can not change the file extension
 */
const fileNameSuffix: ComputedRef<string> = computed(() => {
  if (!(fileBeingRenamed.value && fileBeingRenamed.value.filename)) {
    return '';
  }
  const name = fileBeingRenamed.value.filename;
  return name.substr(name?.lastIndexOf('.'));
});

const initialPagination = {
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 500,
};

/**
 * Computed that resolves an array of path segments: /root/folder1/folderA -> [root, folder1, folderA]
 */
const pathSegments: ComputedRef<string[]> = computed(() => {
  return props.path.substring(1).split('/');
});

/**
 * Extends path by an additional folder name
 *
 * @param folderName - folder name that shall be extended
 */
function extendPath(folderName: string): void {
  if (props.path === '/') {
    emit(EMIT_UPDATE_PATH, `${props.path}${folderName}`);
  } else {
    emit(EMIT_UPDATE_PATH, `${props.path}/${folderName}`);
  }
}

/**
 * Strips path down to a certain path index segment
 *
 * @param index - index of segment. 0 is index of first folder, not Root! Root is handled seperately.
 */
function stripPathTo(index: number): void {
  emit(
    EMIT_UPDATE_PATH,
    `/${pathSegments.value.slice(0, index + 1).join('/')}`
  );
}

/**
 * Sets path to root, which is represented by just a slash /
 */
function setPathToRoot(): void {
  emit(EMIT_UPDATE_PATH, '/');
}

/**
 * Handles click on any file or folder on the list
 *
 * @param row - content of the row, which is either a file or a folder
 */
async function clickOnFileOrFolder(row: FileOrFolder): Promise<void> {
  if (row.type === 'folder' && row.name) {
    extendPath(row.name);
  } else {
    if (fileBeingMoved.value) {
      return;
    }
    const file = await getFile(row.uuid, 360);
    if (file.mimetype && isAudio(file.mimetype)) {
      previewAudio($q, file);
    } else if (file.mimetype && isVideo(file.mimetype)) {
      previewVideo($q, file);
    } else if (file.mimetype && isImage(file.mimetype)) {
      previewImage($q, file);
    } else if (file.mimetype && isPdf(file.mimetype)) {
      previewPdf($q, file);
    } else {
      previewUnknownfile($q, file);
    }
  }
}

/**
 * Initiates moving of a file
 *
 * @param file - file to be moved
 */
function startMovingFile(file: FileEntity): void {
  fileBeingMoved.value = file;
}

/**
 * Performs move operation on a file through the API
 */
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

/**
 * Initiates renaming of a file
 *
 * @param file - file to be renamed
 */
function startFileRenaming(file: FileEntity): void {
  if (!file.filename) {
    newFileNameInput.value = '';
    return;
  }
  newFileNameInput.value = file.filename.substring(
    0,
    file.filename.indexOf('.')
  );
  fileBeingRenamed.value = file;
}

/**
 * Renames a file by calling the API
 */
async function renameFile(): Promise<void> {
  if (fileBeingRenamed.value) {
    await updateFile(
      fileBeingRenamed.value.uuid,
      newFileNameInput.value + fileNameSuffix.value,
      fileBeingRenamed.value.path
    );
    fileBeingRenamed.value = null;
    newFileNameInput.value = '';
  }
  await refresh();
}

/**
 * Opens a new dialog containing access groups, saves changes to access groups on close.
 *
 * @param uuid - uuid of file for which access groups shall be manipulated
 */
async function openAccessControlGroupDialog(uuid: string): Promise<void> {
  const [readAccess, writeAccess] = await Promise.all([
    getFileReadAccessUserGroups(uuid),
    getFileWriteAccessUserGroups(uuid),
  ]);
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
          showSuccessNotification(
            $q,
            i18n.global.t('files.access_rights_edited')
          );
          await refresh();
        })
        .catch((e: any) => {
          console.error(e);
          showErrorNotification(
            $q,
            i18n.global.t('files.access_rights_edit_failed')
          );
        });
    }
  );
}

/**
 * Sort function that ensures folders are always displayed above files
 *
 * @param value1 - First comparison value
 * @param value2 - Second comparison value
 * @param fileFolder1 - File or folder to which first value belongs
 * @param fileFolder2 - File or folder to which second value belongs
 * @returns number indicating sort order
 */
function fileOrFolderSortFunction(
  value1: any,
  value2: any,
  fileFolder1: FileOrFolder,
  fileFolder2: FileOrFolder
): number {
  if (fileFolder1.type === 'file' && fileFolder2.type === 'folder') {
    return 1;
  }
  if (fileFolder1.type === 'folder' && fileFolder2.type === 'file') {
    return -1;
  }
  if (value1 === value2) {
    return 0;
  }
  return value1 < value2 ? -1 : 1;
}

/**
 * Removes a file from the database
 *
 * @param uuid - uuid of file to be removed
 */
async function removeFile(uuid: string): Promise<void> {
  await deleteFile(uuid);
  showSuccessNotification(
    $q,
    i18n.global.t('files.successfully_deleted', { value: 1 })
  );
  await refresh();
}

const fileOrFolderColumns: ColumnInterface<FileOrFolder>[] = [
  {
    name: 'mimetype',
    label: '',
    field: 'mimetype',
    required: true,
    align: ColumnAlign.left,
    sortable: false,
    style: 'width: 50px',
  },
  {
    name: 'name',
    label: i18n.global.t('files.filename'),
    field: 'name',
    required: true,
    align: ColumnAlign.left,
    sortable: true,
    sort: fileOrFolderSortFunction,
  },
  {
    name: 'updatedAt',
    label: i18n.global.t('files.last_updated'),
    field: 'updatedAt',
    required: true,
    align: ColumnAlign.left,
    sortable: true,
    sort: fileOrFolderSortFunction,
  },
  {
    name: 'size',
    label: i18n.global.t('files.size'),
    field: 'size',
    required: true,
    sortable: true,
    sort: fileOrFolderSortFunction,
  },
  {
    name: 'options',
    label: '',
    field: 'options',
  },
];

defineExpose({
  refresh,
});
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
