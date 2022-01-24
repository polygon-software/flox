<template>
  <q-card
    v-if="company"
    class="full-width q-pa-sm"
    style="margin-bottom: 20px; text-align: center"
    flat
  >
    <q-item-label>
      {{ $t('general.welcome') }}, {{ company.first_name }} {{ company.last_name }}!
    </q-item-label>
    <q-item-label caption>
      ID: {{ company.readable_id }}
    </q-item-label>
  </q-card>
</template>

<script setup lang="ts">

import {subscribeToQuery} from 'src/helpers/data-helpers';
import {Ref} from 'vue';
import {MY_COMPANY} from 'src/data/queries/COMPANY';
import {useRoute} from 'vue-router';
const route = useRoute()

// Company ID from route (if any), only relevant if going from SOIAdmin -> Company view
const companyUuid = route.query.cid

const company = subscribeToQuery(MY_COMPANY, companyUuid ? {companyUuid} : {}) as Ref<Record<string, Array<Record<string, unknown>>>>

</script>
