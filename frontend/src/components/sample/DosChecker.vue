<template>
  <q-card class="q-column q-pa-md text-center" style="width: 300px">
    <h5 class="q-ma-none q-mb-md q-mt-sm">Flox Modules:</h5>
    <q-separator />
    <div class="row">
      <div class="col">
        <div
          class="text-positive"
          v-text="`${$t('general.successful')}: ${positiveRequest}`"
        />
        <div
          class="text-negative"
          v-text="`${$t('general.failed')}: ${negativeRequest}`"
        />
      </div>
      <div class="col">
        <q-input
          v-model="requestsPerSecond"
          outlined
          type="number"
          label="Requests / second"
          :disable="!!dosInterval"
        />
        <q-btn color="primary" @click="toggleDos"> Start / Stop </q-btn>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import axios from 'axios';
import { print } from 'graphql';
import { Ref, ref } from 'vue';

import Env from 'src/env';
import { getBearerToken } from 'src/flox/modules/auth/tools/auth.tools';
import { GET_MY_USER } from 'src/flox/modules/auth/user.query';

const requestsPerSecond: Ref<number> = ref(10);
const positiveRequest: Ref<number> = ref(0);
const negativeRequest: Ref<number> = ref(0);

let dosInterval: ReturnType<typeof setInterval> | null;

const headers = {
  Authorization: getBearerToken(),
  'Content-Type': 'application/json',
};

/**
 * Starts/Stops a DOS attack on our own backend
 */
function toggleDos(): void {
  if (dosInterval) {
    clearInterval(dosInterval);
    dosInterval = null;
  } else {
    positiveRequest.value = 0;
    negativeRequest.value = 0;
    dosInterval = setInterval(() => {
      const query = {
        query: print(GET_MY_USER.query),
      };
      axios
        .post(Env.VUE_APP_GRAPHQL_ENDPOINT, query, { headers })
        .then(({ data }) => {
          if ((data as Record<string, unknown>).errors) {
            negativeRequest.value += 1;
          } else {
            positiveRequest.value += 1;
          }
        })
        .catch(() => {
          negativeRequest.value += 1;
        });
    }, 1000 / requestsPerSecond.value);
  }
}
</script>
