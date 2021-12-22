<template>
  <q-page class="flex flex-center">
    <div class="column">
      <GenericForm
        v-if="companyId"
        :finish-label="$t('buttons.finish_signup')"
        :pages="pages"
        :loading="loading"
        :loading-label="$t('status.uploading') + '...'"
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
import {inject, ref} from 'vue';
import GenericForm from 'components/forms/GenericForm.vue'
import {useRoute} from 'vue-router';
import axios from 'axios';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';

const $routerService: RouterService|undefined = inject('$routerService')

// Upload loading status
const loading = ref(false)

// Get base64-encoded UUID from URL params
const route = useRoute()
const companyId = route.query.cid

const accountFields = [
  FIELDS.FILE_UPLOAD,
]

const pages = [
  {
    key: 'file_upload',
    label: i18n.global.t('documents.document_upload'),
    fields: accountFields,
  },
]

/**
 * Uploads the user's files and, if OK, redirects
 * @param {Record<string, Record<string, File|null>>} values - uploaded files
 * @returns {void}
 */
async function onSubmit(values: Record<string, Record<string, File|null>>){

  loading.value = true

  const fileObject: Record<string, File|null> = values.file_upload
  const headers = { 'Content-Type': 'multipart/form-data' }

  for(const fileKey of Object.keys(fileObject)) {
    const formData = new FormData();
    if(fileObject[fileKey]) {
      // Convert to Blob and append
      const blob = fileObject[fileKey] as Blob
      formData.append('file', blob)

      // Get ID from route
      if(!route.query.cid){
        throw new Error('Invalid URL')
      }
      const cid: string = route.query.cid.toString()
      const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL ??  ''

      await axios({
        method: 'post',
        url: `${baseUrl}/uploadCompanyFile?cid=${cid}`,
        data: formData,
        headers: headers,
      }).catch((e: Error) => {
        throw new Error(`File upload error: ${e.message}`)
      })
    }
  }

  // TODO add fitting success message
  await $routerService.routeTo(ROUTES.SUCCESS)
}
</script>
