<template>
  <!-- Passport or ID -->
  <q-file
    class="q-mb-md"
    outlined
    v-model="passport"
    accept="image/*, .pdf"
    :label="$t('passport_or_id')"
    stack-label
    clearable
    :rules="[(val) => {val !== null || $t('missing_file')}]"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <!--- Commercial Register Extract -->
  <q-file
    class="q-mb-md"
    outlined
    v-model="commercial_register_extract"
    accept="image/*, .pdf"
    :label="`${$t('commercial_register_extract')} (${$t('optional')})`"
    stack-label
    clearable
    :rules="[]"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <!-- Execution Register Extract -->
  <q-file
    class="q-mb-md"
    outlined
    v-model="execution_register_extract"
    accept="image/*, .pdf"
    :label="$t('execution_register_extract')"
    stack-label
    clearable
    :rules="[(val) => {val !== null || $t('missing_file')}]"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <!-- Additional Documents -->
  <component
    v-for="(field, index) in additional_input_fields"
    :key="index"
    :is="field.component"
    class="q-mb-md"
    outlined
    v-model="field.model"
    accept="image/*, .pdf"
    :label="$t('additional_documents')"
    stack-label
    clearable
    :rules="[]"
    @update:model-value="fileChange"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>
  </component>

</template>
<script setup lang="ts">
import {markRaw, ref} from 'vue';
import {QFile} from 'quasar';

const passport = ref()
const commercial_register_extract = ref()
const execution_register_extract = ref()
const additional_input_fields = ref([
  {
    model: null,
    component: markRaw(QFile),
  },
])

function fileChange(): void {
  const size = additional_input_fields.value.length

  // Only 1 additional field
  if (size === 1) {
    // File was deleted -> do nothing
    if (additional_input_fields.value[0].model == null) {
      console.log("deleted, size 1")
      return;
    }
    // Fille was added -> add new field
    additional_input_fields.value.push({model: null, component: markRaw(QFile)})
    console.log("added, size 1")
    return;
  }

  // Check if there's a field with model value === null
  for (let index=0; index<size; index++) {
    const field = additional_input_fields.value[index]
    // A file was delted
    if(field.model === null) {
      // Last field -> do nothing
      if (index === size-1) {
        console.log("deleted, last element")
        return;
      }
      // Not last elemnt -> delete field
      console.log("deleted")
      additional_input_fields.value.slice(index, 1)
      return;
    }
  }
  // File was added or updated
  console.log("added")
  additional_input_fields.value.push({model: null, component: markRaw(QFile)})
}

</script>
