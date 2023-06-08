<template>
  <q-card-section>
    <q-list separator>
      <q-item
        v-for="(file, index) in files"
        :key="file.content.name"
        class="row justify-between flex-center"
      >
        <q-item-section class="col-auto">
          <q-item-label>
            {{ file.content.name }}
          </q-item-label>

          <q-item-label caption>
            {{ $t('files.status') }}:
            {{ $t(`files.status_${file.status}`) }}
          </q-item-label>
        </q-item-section>

        <!-- Preview -->
        <q-item-section class="row flex-center col-grow">
          <q-img
            v-if="file.content.type.includes('image/')"
            :src="file.url"
            spinner-color="primary"
            style="max-width: 250px; max-height: 100px"
            fit="contain"
          />
          <q-item-label v-else>
            {{ $t('files.no_preview') }}
          </q-item-label>
        </q-item-section>

        <!-- Remove file -->
        <q-item-section top side>
          <q-btn
            class="gt-xs"
            size="12px"
            flat
            dense
            round
            icon="delete"
            @click="emitRemoveFile(index)"
          >
            <q-tooltip>
              {{ $t('files.remove') }}
            </q-tooltip>
          </q-btn>
        </q-item-section>

        <!-- Download file -->
        <q-item-section
          v-if="file.status === 'done' && file.fileEntity"
          top
          side
        >
          <q-btn
            class="gt-xs"
            size="12px"
            flat
            dense
            round
            icon="download"
            @click="emitDownloadFile(file.fileEntity)"
          >
            <q-tooltip>
              {{ $t('files.download') }}
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card-section>
</template>

<script setup lang="ts">
import { SelectedFile } from 'src/flox/modules/file/tools/upload.tools';
import FileEntity from 'src/flox/modules/file/entities/file.entity';

const props = defineProps<{
  files: SelectedFile[];
}>();

const emit = defineEmits<{
  (e: 'remove-file', index: number): void;
  (e: 'download-file', file: FileEntity): void;
}>();

const emitRemoveFile = (index: number): void => {
  emit('remove-file', index);
};

const emitDownloadFile = (file: FileEntity | undefined): void => {
  if (file) {
    emit('download-file', file);
  }
};
</script>
