<template>
  <!-- Image files -->
  <div class="row">
    <q-file
    v-for="(picture, index) in pictures"
    :key="index"
    v-model="picture.value"
    class="q-mb-md"
    outlined
    accept="image/*"
    :label="$t('products.image') + ' ' + (index+1).toString()"
    stack-label
    clearable
    :max-file-size="props.maxFileSize"
    :rules="[]"
    style="width: 150px; height: 100px; overflow: hidden"
    @update:model-value="fileChange"
  >
    <img
      v-if="urls[index]"
      :src="urls[index]"
      style="position: absolute; top: 0; left: 0; width: 150px; height: 100px"
    />
  </q-file>
  </div>
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
const urls: Ref<string[]> = ref([])

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
function fileChange(newFile: File): void {
  // Generate preview URL for new file
  if(newFile){
    const reader = new FileReader();
    reader.onload = (e) => {
      if(e && e.target){
        const url = e.target.result;
        if(url){
          urls.value.push(url.toString())
        }
      }
    }
    reader.readAsDataURL(newFile);
  }

  const size = pictures.value.length

  // Only 1 additional field
  if (size === 1) {
    // File was deleted -> do nothing
    if (pictures.value[0].value === null) {
      // TODO: delete from URLs as well
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
