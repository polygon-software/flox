<template>
  <q-page class="flex flex-center">
    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="flex flex-center loading-indicator"
    >
      <div class="column">
        <q-spinner
          size="50px"
          color="primary"
        />
        <h6 class="text-primary">
          {{ $t('general.loading') }}
        </h6>
      </div>
    </div>
    <div
      v-else
      class="column q-pa-sm"
      style="width: 1000px"
    >
      <dossier-form
        v-if="dossierUuid && dossier"
        :prefill-dossier="dossier"
      />
      <q-card
        v-else
        class="q-pa-md text-center"
      >
        <q-icon
          class="q-mr-md"
          color="negative"
          name="block"
          size="xl"
        />
        <strong>
          {{ $t('errors.invalid_link') }}
        </strong>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import DossierForm from 'components/forms/DossierForm.vue';
import {useRoute} from 'vue-router';
import {onMounted, Ref, ref} from 'vue';
import {executeQuery} from 'src/helpers/data-helpers';
import {GET_DOSSIER} from 'src/data/queries/DOSSIER';

const route = useRoute()
const dossierUuid = route.query.did
const dossier: Ref<Record<string, unknown> | null> = ref(null)
const loading = ref(true)

onMounted(async () => {
  // If URL is valid, fetch dossier
  if(dossierUuid){
    const dossierQuery = await executeQuery(GET_DOSSIER, {uuid: dossierUuid})
    if(dossierQuery.data[GET_DOSSIER.cacheLocation]){
      dossier.value = dossierQuery.data[GET_DOSSIER.cacheLocation] as Record<string, unknown>
      loading.value = false
    }
  }
})
</script>
