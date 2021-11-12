<template>
  <q-input
    dense
    v-model="first_name"
    :label="$t('first_name')"
    type="text"
    lazy-rules="ondemand"
    :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_name')]"
  >
  </q-input>
  <q-input
    dense
    v-model="last_name"
    :label="$t('last_name')"
    type="text"
    lazy-rules="ondemand"
    :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_name')]"
  >
  </q-input>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IS_VALID_STRING } from 'src/data/RULES';

const first_name = ref('')
const last_name = ref('')


</script>
