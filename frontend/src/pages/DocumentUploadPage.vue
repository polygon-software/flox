<template>
  <q-page class="flex flex-center">
    <div class="column">
      <q-card class="q-pa-md">
        <DocumentUploadForm :pages="pages"/>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import {i18n} from 'boot/i18n';
import DocumentUploadForm from 'components/forms/DocumentUploadForm.vue';

const account_fields = [
  FIELDS.FILE_UPLOAD,
]

const pages = [
  {
    key: 'file_upload',
    label: i18n.global.t('document_upload'),
    fields: account_fields,
  },
]
</script>
