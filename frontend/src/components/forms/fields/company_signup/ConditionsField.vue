<template>
  <strong>{{ $t('account_data.conditions') }}</strong>
  <embed
    :src="pdf_link"
    class="q-mt-md q-pa-md"
    frameBorder="0"
    scrolling="auto"
    height="500px"
    width="100%"
  />
  <q-field
    v-model="accept_conditions"
    :rules="[(val) => val === true || $t('errors.must_accept_conditions')]"
    borderless
    dense
  >
    <template #control>
        <q-checkbox
          v-model="accept_conditions"
          :label="$t('account_data.accept_conditions')"
          @update:model-value="emitValue"
        />
    </template>
  </q-field>
  <q-field
    v-model="accept_condition_truthful"
    :rules="[(val) => val === true || $t('errors.must_accept_condition_truthful')]"
    borderless
    dense
  >
    <template #control>
        <q-checkbox
          v-model="accept_condition_truthful"
          :label="$t('account_data.accept_condition_truthful')"
          @update:model-value="emitValue"
        />
    </template>
  </q-field>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue'
const emit = defineEmits(['change'])

const accept_conditions: Ref<boolean> = ref(false)
const accept_condition_truthful: Ref<boolean> = ref(false)
const show_error: Ref<boolean> = ref(false)
const pdf_link = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'

/**
 * Emits the picked value
 * @returns {void}
 */
function emitValue(){
  if(accept_conditions.value && accept_condition_truthful.value){
    emit('change', accept_conditions.value)
    emit('change', accept_condition_truthful.value)
  } else {
    show_error.value = true
  }
}
</script>
