<template>
  <!-- Passport or ID -->
  <q-file
    v-model="passport"
    class="q-mb-md"
    outlined
    accept="image/*, .pdf"
    :label="$t('passport_or_id')"
    stack-label
    clearable
    :max-file-size="maxFileSize"
    :rules="[(val) => val !== null || $t('missing_file')]"
    @change="emitValue"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <!--- Commercial Register Extract -->
  <q-file
    v-model="commercial_register_extract"
    class="q-mb-md"
    outlined
    accept="image/*, .pdf"
    :label="`${$t('commercial_register_extract')} (${$t('optional')})`"
    stack-label
    clearable
    :max-file-size="maxFileSize"
    :rules="[]"
    @change="emitValue"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <!-- Execution Register Extract -->
  <q-file
    v-model="execution_register_extract"
    class="q-mb-md"
    outlined
    accept="image/*, .pdf"
    :label="$t('execution_register_extract')"
    stack-label
    clearable
    :max-file-size="maxFileSize"
    :rules="[(val) => val !== null || $t('missing_file')]"
    @change="emitValue"
  >
    <template v-slot:prepend>
      <q-icon name="attach_file" />
    </template>
  </q-file>

  <!-- Additional Documents -->
  <component
    :is="field.component"
    v-for="(field, index) in additional_input_fields"
    :key="index"
    v-model="field.model"
    class="q-mb-md"
    outlined
    accept="image/*, .pdf"
    :label="$t('additional_documents')"
    stack-label
    clearable
    :max-file-size="maxFileSize"
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

const emit = defineEmits(['change'])
const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 5e7
  }
})

const passport = ref(null)
const commercial_register_extract = ref(null)
const execution_register_extract = ref(null)

/**
 * Emits the updated value
 */
function emitValue(){
  emit('change', {passport, commercial_register_extract, execution_register_extract, additional_input_fields})
}

/**
 * This section handles the addition and deltetion of custom files.
 */
const additional_input_fields = ref([
  {
    model: null,
    component: markRaw(QFile),
  },
])

/**
 * Depending on how many additional fields already exist, adds or deletes a file from a custom field.
 */
function fileChange(): void {
  const size = additional_input_fields.value.length

  // Only 1 additional field
  if (size === 1) {
    // File was deleted -> do nothing
    if (additional_input_fields.value[0].model == null) {
      emitValue()
      return;
    }
    // Fille was added -> add new field
    additional_input_fields.value.push({model: null, component: markRaw(QFile)})
    emitValue()
    return;
  }

  // Check if there's a field with model value === null
  for (let index=0; index<size; index++) {
    const field = additional_input_fields.value[index]
    // A file was deleted
    if(field.model === null) {
      // Last field -> do nothing
      if (index === size-1) {
        emitValue()
        return;
      }
      // Not last elemnt -> delete field
      additional_input_fields.value.splice(index, 1)
      emitValue()
      return;
    }
  }
  // File was added or updated
  additional_input_fields.value.push({model: null, component: markRaw(QFile)})
  emitValue()
}

</script>
