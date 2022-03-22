<template>
  <q-page class="flex flex-center">
    <div
      class="column q-pa-sm"
      style="width: 1000px"
    >
      <new-dossier-form
        v-if="dossierUuid"
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
import NewDossierForm from 'components/forms/NewDossierForm.vue';
import {useRoute} from 'vue-router';

const route = useRoute()
const dossierUuid = route.query.did
</script>
