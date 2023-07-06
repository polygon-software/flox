<template>
  <!-- File picker -->
  <q-card class="justify-center q-px-md" style="width: 600px" flat bordered>
    <h5>
      {{ $t('fields.article_upload.title') }}
    </h5>
    <q-file
      v-model="fileInput"
      accept=".xlsx"
      outlined
      :label="$t('fields.article_upload.select_file')"
    >
      <template #append>
        <q-icon
          v-if="fileInput"
          name="cancel"
          style="cursor: pointer"
          @click="fileInput = null"
        />
      </template>
    </q-file>
    <q-btn
      class="q-my-md"
      :class="`${DEFAULT_BUTTON_CLASS} q-my-md`"
      :style="`${DEFAULT_BUTTON_STYLE}; width: 200px`"
      :label="$t('fields.article_upload.submit')"
      unelevated
      outline
      :disable="!canSubmit"
      @click="createArticles"
    />
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';

import {
  DEFAULT_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from 'src/css/defaultStyles';
import {
  createArticleList,
  createFile,
} from 'src/flox/modules/file/services/file.service';
import {
  SelectedFile,
  uploadFile,
} from 'src/flox/modules/file/tools/upload.tools';
import { UploadStatus } from 'src/flox/modules/file/enums/uploadStatus.enum';

const loading = ref(false);
const fileInput: Ref<File | null> = ref(null);

const canSubmit = computed(() => {
  return fileInput.value !== null;
});

/**
 * Encodes the Excel file to base64 and sends it to the backend.
 * @returns void
 */
async function createArticles(): Promise<void> {
  loading.value = true;
  if (fileInput.value) {
    // Step 1: Send the file to the backend
    const createdFile = await uploadFile(
      {
        content: fileInput.value,
        url: URL.createObjectURL(fileInput.value),
        status: UploadStatus.READY,
      },
      {}
    );

    if (!createdFile) {
      throw new Error('Unable to upload the article list');
    }

    // Step 2: Create the articles
    const createdArticles = await createArticleList(createdFile.uuid);

    if (!createdArticles) {
      throw new Error(`Unable to create articles for file ${createdFile.uuid}`);
    }
  }
  loading.value = false;
}
</script>
