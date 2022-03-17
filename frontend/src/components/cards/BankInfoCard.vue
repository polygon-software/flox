<template>
  <q-card
    v-if="bank"
    class="full-width q-pa-sm"
    style="margin-bottom: 20px; text-align: center"
    flat
  >
    <q-item-label>
      {{ $t('general.welcome') }}, {{ bank.name }}
    </q-item-label>
    <q-item-label caption>
      ID: {{ bank.readable_id }}
    </q-item-label>
  </q-card>
</template>

<script setup lang="ts">

import {subscribeToQuery} from 'src/helpers/data-helpers';
import {Ref} from 'vue';
import {useRoute} from 'vue-router';
import {MY_BANK} from 'src/data/queries/BANK';

const route = useRoute()

// Bank ID from route (if any), only relevant if going from SOIAdmin -> Bank view
const bankUuid = route.query.bid

const bank = subscribeToQuery(MY_BANK, bankUuid ? {bankUuid} : {}) as Ref<Record<string, Array<Record<string, unknown>>>>

</script>
