<template>
  <q-input
    v-model="firstName"
    :label="$t('account_data.first_name')"
    type="text"
    :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_name')]"
    @change="emitValue"
  >
  </q-input>
  <q-input
    v-model="lastName"
    :label="$t('account_data.last_name')"
    type="text"
    :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_name')]"
    @change="emitValue"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IS_VALID_STRING } from 'src/data/RULES';
const emit = defineEmits(['change'])

const firstName = ref('')
const lastName = ref('')

/**
 * Emits the inputs
 * @returns {void}
 */
function emitValue(){
  emit('change', {
    first_name: firstName.value,
    last_name: lastName.value
  })
}

</script>
