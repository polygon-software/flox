<template>
  <!-- File picker -->
  <q-card class="justify-center q-px-md" style="width: 600px" flat bordered>
    <h5>
      {{ $t('fields.article_upload.title') }}
    </h5>
    <div v-if="!loading">
      <!-- File input -->
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

      <!-- Upload button -->
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
    </div>

    <!-- Loading spinner -->
    <div v-else class="q-my-md column items-center">
      <div>{{ $t('fields.article_upload.loading') }}</div>
      <q-spinner-dots color="primary" size="3em" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { useQuasar } from 'quasar';

import {
  DEFAULT_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from 'src/css/defaultStyles';
import { createArticleList } from 'src/flox/modules/file/services/file.service';
import { uploadFile } from 'src/flox/modules/file/tools/upload.tools';
import { UploadStatus } from 'src/flox/modules/file/enums/uploadStatus.enum';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';
import { i18n } from 'boot/i18n';

const $q = useQuasar();

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
      showErrorNotification($q, i18n.global.t('errors.file_upload_failed'), {
        position: 'bottom',
        timeout: 2000,
      });
    }

    // Step 2: Create the articles
    const result = await createArticleList(createdFile.uuid);

    if (!result) {
      showErrorNotification($q, i18n.global.t('errors.articles_not_created'), {
        position: 'bottom',
        timeout: 2000,
      });
    } else {
      showSuccessNotification($q, i18n.global.t('messages.articles_created'), {
        position: 'bottom',
        timeout: 2000,
      });
    }

    // Reset file input
    fileInput.value = null;
  }
  loading.value = false;
}
</script>
