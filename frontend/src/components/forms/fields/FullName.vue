<template>
  <q-input
    dense
    v-model="first_name"
    :label="$t('first_name')"
    type="text"
    lazy-rules="ondemand"
    :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_name')]"
    @change="emitValue"
  >
  </q-input>
  <q-input
    dense
    v-model="last_name"
    :label="$t('last_name')"
    type="text"
    lazy-rules="ondemand"
    :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_name')]"
    @change="emitValue"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IS_VALID_STRING } from 'src/data/RULES';
const emit = defineEmits(['change'])

const first_name = ref('')
const last_name = ref('')

function emitValue(){
  emit('change', {
    first_name: first_name.value,
    last_name: last_name.value,
  })
}

</script>
