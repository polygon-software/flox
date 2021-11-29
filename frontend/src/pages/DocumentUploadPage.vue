<template>
  <q-page class="flex flex-center">
    <div class="column">
      <GenericForm
        v-if="companyId"
        :finish-label="$t('buttons.finish_signup')"
        :pages="pages"
        @submit="onSubmit"
      />
      <q-card
        v-else
        class="q-pa-md bg-red"
      >
        <h2>
          Error: Invalid link...
        </h2>
        <!-- TODO styling -->
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import {i18n} from 'boot/i18n';
import {inject} from 'vue';
import GenericForm from 'src/components/forms/GenericForm.vue'
import {useRoute} from 'vue-router';
import axios from 'axios';
import {RouterService} from 'src/services/RouterService';

const emit = defineEmits(['submit'])
const $routerService: RouterService = inject('$routerService')

// Get base64-encoded UUID from URL params
const route = useRoute()
const companyId = route.query.cid

const account_fields = [
  FIELDS.FILE_UPLOAD,
]

const pages = [
  {
    key: 'file_upload',
    label: i18n.global.t('documents.document_upload'),
    fields: account_fields,
  },
]

/**
 * Uploads the user's files and, if OK, redirects
 */
async function onSubmit(values: Record<string, Record<string, File|null>>){
  const fileObject: Record<string, File|null> = values.file_upload
  console.log('Files are:',fileObject)
  const headers = { 'Content-Type': 'multipart/form-data' }

  for(const fileKey of Object.keys(fileObject)) {
    const formData = new FormData();
    if(fileObject[fileKey]) {
      // Convert to Blob and append
      const blob = fileObject[fileKey] as Blob
      formData.append('file', blob)

      // Get ID from route
      const cid: string = route.params.cid.toString()

      await axios({
        method: 'post',
        url: `http://localhost:3000/uploadCompanyFile?cid=${cid}`, // TODO actual URL from env
        data: formData,
        headers: headers,
      }).catch((e: Error) => {
        throw new Error(`File upload error: ${e.message}`)
      })
    }
  }

  // TODO add fitting success message
  // await $routerService.routeTo(ROUTES.SUCCESS)
}
</script>
