<template>
  <!-- Documents -->
  <q-file
    v-for="(field, index) in files"
    :key="index"
    v-model="field.value"
    class="q-mb-md"
    outlined
    accept=".pdf"
    :label="$t(index === 0 ? 'documents.choose_documents' : 'documents.additional_documents')"
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

const files: Ref<Array<Ref<null|File>>> = ref([ref(null)])

/**
 * Emits the updated value
 * @returns {void}
 */
function emitValue(){
  const validFiles = files.value.filter(field => {
    return field.value !== null
  })

  // Add a name (e.g. 'offer_1') to every file
  const offerFiles: Record<string, File> = {}
  for(let i = 0; i < validFiles.length; i++){
    const key = `offer_${i+1}`
    const file = validFiles[i].value
    if(file){
      offerFiles[key] = file
    }
  }

  // TODO inner validation?
  emit('change', offerFiles)
}

/**
 * Depending on how many additional fields already exist, adds or deletes a file from a custom field.
 * @returns {void}
 */
function fileChange(): void {
  const size = files.value.length

  // Only 1 additional field
  if (size === 1) {
    // File was deleted -> do nothing
    if (files.value[0].value === null) {
      emitValue()
      return;
    }
    // File was added -> add new field
    files.value.push(ref(null))
    emitValue()
    return;
  }

  // Check if there's a field with model value === null
  for (let index=0; index<size; index++) {
    const field = files.value[index]
    // A file was deleted
    if(field.value === null) {
      // Last field -> do nothing
      if (index === size-1) {
        emitValue()
        return;
      }
      // Not last element -> delete field
      files.value.splice(index, 1)
      emitValue()
      return;
    }
  }
  // File was added or updated
  files.value.push(ref(null))
  emitValue()
}

</script>
