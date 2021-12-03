<template>
  <!-- Image files -->
  <q-file
    v-for="(field, index) in pictures"
    :key="index"
    v-model="field.value"
    class="q-mb-md"
    outlined
    accept="image/*, .pdf"
    :label="$t('image') + ' ' + (index+1).toString()"
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
import {Ref, ref, defineEmits, defineProps} from 'vue';

const emit = defineEmits(['change'])
const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 5e7
  }
})

const pictures: Ref<Array<Ref<null|File>>> = ref([ref(null)])

/**
 * Emits the updated value
 */
function emitValue(){

  const validPictures = pictures.value.filter(field => {
    return field.value !== null
  })

  // Add a name (e.g. 'additional_1') to every additional file
  const additionalFiles: Record<string, File> = {}
  for(let i = 0; i < validPictures.length; i++){
    const key = `picture_${i+1}`
    const file = validPictures[i].value
    if(file){
      additionalFiles[key] = file
    }
  }

  // TODO inner validation?
  emit('change', pictures.value)
}

/**
 * Depending on how many additional fields already exist, adds or deletes a file from a custom field.
 */
function fileChange(): void {
  const size = pictures.value.length

  // Only 1 additional field
  if (size === 1) {
    // File was deleted -> do nothing
    if (pictures.value[0].value === null) {
      emitValue()
      return;
    }
    // File was added -> add new field
    pictures.value.push(ref(null))
    emitValue()
    return;
  }

  // Check if there's a field with model value === null
  for (let index=0; index<size; index++) {
    const field = pictures.value[index]
    // A file was deleted
    if(field.value === null) {
      // Last field -> do nothing
      if (index === size-1) {
        emitValue()
        return;
      }
      // Not last element -> delete field
      pictures.value.splice(index, 1)
      emitValue()
      return;
    }
  }
  // File was added or updated
  pictures.value.push(ref(null))
  emitValue()
}

</script>
