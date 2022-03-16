<template>
  <strong>{{ $t('account_data.conditions') }}</strong>
  <embed
    :src="pdfLink"
    class="q-mt-md q-pa-md"
    frameBorder="0"
    scrolling="auto"
    height="500px"
    width="100%"
  />
  <q-field
    v-model="acceptConditions"
    :rules="[(val) => val === true || $t('errors.must_accept_conditions')]"
    borderless
    dense
  >
    <template #control>
        <q-checkbox
          v-model="acceptConditions"
          :label="$t('account_data.accept_conditions')"
          @update:model-value="emitValue"
        />
    </template>
  </q-field>
  <q-field
    v-model="acceptConditionTruthful"
    :rules="[(val) => val === true || $t('errors.must_accept_condition_truthful')]"
    borderless
    dense
  >
    <template #control>
        <q-checkbox
          v-model="acceptConditionTruthful"
          :label="$t('account_data.accept_condition_truthful')"
          @update:model-value="emitValue"
        />
    </template>
  </q-field>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue'
const emit = defineEmits(['change'])

const acceptConditions: Ref<boolean> = ref(false)
const acceptConditionTruthful: Ref<boolean> = ref(false)
const showError: Ref<boolean> = ref(false)

// TODO change once provided by SOI
const pdfLink = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'

/**
 * Emits the picked value
 * @returns {void}
 */
function emitValue(){
  if(acceptConditions.value && acceptConditionTruthful.value){
    emit('change', acceptConditions.value)
    emit('change', acceptConditionTruthful.value)
  } else {
    showError.value = true
  }
}
</script>
