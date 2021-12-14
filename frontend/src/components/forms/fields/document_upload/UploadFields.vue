<template>
  <!-- Passport or ID -->
  <q-file
    v-model="passport"
    class="q-mb-md"
    outlined
    accept="image/*, .pdf"
    :label="$t('account_data.passport_or_id')"
    stack-label
    clearable
    :max-file-size="props.maxFileSize"
    :rules="[(val) => val !== null || $t('errors.missing_file')]"
    @update:model-value="emitValue"
  >
    <template #prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <!--- Commercial Register Extract -->
  <q-file
    v-model="commercialRegisterExtract"
    class="q-mb-md"
    outlined
    accept="image/*, .pdf"
    :label="`${$t('account_data.commercial_register_extract')} (${$t('account_data.optional')})`"
    stack-label
    clearable
    :max-file-size="props.maxFileSize"
    :rules="[]"
    @update:model-value="emitValue"
  >
    <template #prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <!-- Execution Register Extract -->
  <q-file
    v-model="executionRegisterExtract"
    class="q-mb-md"
    outlined
    accept="image/*, .pdf"
    :label="$t('account_data.execution_register_extract')"
    stack-label
    clearable
    :max-file-size="props.maxFileSize"
    :rules="[(val) => val !== null || $t('errors.missing_file')]"
    @update:model-value="emitValue"
  >
    <template #prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <!-- Additional Documents -->
  <q-file
    v-for="(field, index) in additionalInputFields"
    :key="index"
    v-model="field.value"
    class="q-mb-md"
    outlined
    accept="image/*, .pdf"
    :label="$t('documents.additional_documents')"
    stack-label
    clearable
    :max-file-size="props.maxFileSize"
    :rules="[]"
    @update:model-value="fileChange"
  >
    <template #prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

</template>
<script setup lang="ts">
import {Ref, ref} from 'vue';

const emit = defineEmits(['change'])
const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 5e7
  }
})

const passport = ref(null)
const commercialRegisterExtract = ref(null)
const executionRegisterExtract = ref(null)

/**
 * Emits the updated value
 * @returns {void}
 */
function emitValue(){
  const validAdditionalInputFields = additionalInputFields.value.filter(field => {
    return field.value !== null
  })

  // Add a name (e.g. 'additional_1') to every additional file
  const additionalFiles: Record<string, File> = {}
  for(let i = 0; i < validAdditionalInputFields.length; i++){
    const key = `additional_${i+1}`
    const file = validAdditionalInputFields[i].value
    if(file){
      additionalFiles[key] = file
    }
  }

  // TODO inner validation?
  emit('change', {passport, commercialRegisterExtract, executionRegisterExtract, ...additionalFiles})
}

/**
 * This section handles the addition and deletion of custom files.
 */
const additionalInputFields: Ref<Array<Ref<null|File>>> = ref([ref(null)])

/**
 * Depending on how many additional fields already exist, adds or deletes a file from a custom field.
 * @returns {void}
 */
function fileChange(): void {
  const size = additionalInputFields.value.length

  // Only 1 additional field
  if (size === 1) {
    // File was deleted -> do nothing
    if (additionalInputFields.value[0].value === null) {
      emitValue()
      return;
    }
    // File was added -> add new field
    additionalInputFields.value.push(ref(null))
    emitValue()
    return;
  }

  // Check if there's a field with model value === null
  for (let index=0; index<size; index++) {
    const field = additionalInputFields.value[index]
    // A file was deleted
    if(field.value === null) {
      // Last field -> do nothing
      if (index === size-1) {
        emitValue()
        return;
      }
      // Not last element -> delete field
      additionalInputFields.value.splice(index, 1)
      emitValue()
      return;
    }
  }
  // File was added or updated
  additionalInputFields.value.push(ref(null))
  emitValue()
}

</script>
