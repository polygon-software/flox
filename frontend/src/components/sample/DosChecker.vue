<template>
  <q-card class="q-column q-pa-md text-center q-ma-md" style="width: 300px">
    <h5
      class="q-ma-none q-mb-md q-mt-sm"
    >
      Flox Modules:
    </h5>
    <q-separator/>
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
        <q-input v-model="requestsPerSecond" outlined type="number" label="Requests / second" :disable="!!dosInterval" />
        <q-btn color="primary" @click="toggleDos" v-text="'Start / Stop'"/>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import axios from 'axios';
import {MY_USER} from 'src/data/queries/USER';
import {getBearerToken} from 'src/helpers/tools/auth-helpers';
import {print} from 'graphql';

const requestsPerSecond: Ref<number> = ref(10);
const positiveRequest: Ref<number> = ref(0);
const negativeRequest: Ref<number> = ref(0);

let dosInterval: ReturnType<typeof setInterval> | null;

const headers = {
  Authorization: getBearerToken(),
  'content-type': 'application/json',
}

/**
 * Starts/Stops a DOS attack on our own backend
 * @returns {void} nothing
 */
function toggleDos() {
  if (dosInterval) {
    clearInterval(dosInterval);
    dosInterval = null;
  } else {
    positiveRequest.value = 0;
    negativeRequest.value = 0;
    dosInterval = setInterval(() => {
      console.log('Fetch my user');
      const query = {
        query: print(MY_USER.query)
      }
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      axios.post(`${process.env.VUE_APP_BACKEND_URL}/graphql`, query, { headers })
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
    }, 1000 / requestsPerSecond.value)
  }
}

</script>

<style scoped>

</style>
