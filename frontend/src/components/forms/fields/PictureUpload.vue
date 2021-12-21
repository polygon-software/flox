<template>
  <!-- Image files -->
  <div class="row">
    <q-file
      v-for="(picture, index) in pictures"
      :key="index"
      v-model="picture.value"
      class="q-ma-md"
      style="max-width: 300px;"
      outlined
      accept="image/*"
      :label="$t('products.image') + ' ' + (index+1).toString()"
      stack-label
      clearable
      display-value=""
      :max-file-size="props.maxFileSize"
      :rules="[]"
      @update:model-value="fileChange"
    >
      <img
        v-if="urls[index]"
        :src="urls[index]"
        :alt="index"
        class="q-my-md"
        style="max-height: 150px"
      />
    </q-file>
  </div>
</template>
<script setup lang="ts">
import {Ref, ref, defineEmits, defineProps, watch} from 'vue';
import {toDataUrl} from 'src/helpers/image-helper';
const emit = defineEmits(['change'])
const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 5e7
  },
  pictures: {
    type: Array,
    default: () => [],
  },
})
const pictures: Ref<Array<Ref<null|File>>> = ref([ref(null)])
// Watcher for pre-existing picture input; triggered only once!
const stop = watch(() => props.pictures, async () => {
  if(props.pictures && props.pictures.length > 0){
    // Stop after receiving initial value
    stop()
    pictures.value = []
    for(const picture of props.pictures){
      pictures.value.splice(0, 0, picture as Ref<File>)
      await fileChange()
    }
  }
})
const urls: Ref<Array<null|ArrayBuffer|string>> = ref([])
/**
 * Emits the updated value
 * @returns {void}
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
 * Updates the image url array so it always matches the image file array.
 * @returns {void}
 */
async function updateUrls(): Promise<void> {
  urls.value = []
  for (const picture of pictures.value) {
    if (picture.value) {
      const url = await toDataUrl(picture.value)
      urls.value.push(url)
    }
  }
}
/**
 * Depending on how many additional fields already exist, adds or deletes a file from a custom field.
 * @returns {void}
 */
async function fileChange(): Promise<void> {
  const size = pictures.value.length
  // Only 1 additional field
  if (size === 1) {
    // File was deleted -> remove first url
    if (pictures.value[0].value === null) {
      emitValue()
      await updateUrls()
      return;
    }
    // File was added -> add new field
    pictures.value.push(ref(null))
    emitValue()
    await updateUrls()
    return;
  }
  // Check if there's a field with model value === null
  for (let index=0; index<size; index++) {
    const field = pictures.value[index]
    // A file was deleted
    if(field.value === null) {
      // Last field -> delete last url
      if (index === size-1) {
        emitValue()
        await updateUrls()
        return;
      }
      // Not last element -> delete field
      pictures.value.splice(index, 1)
      emitValue()
      await updateUrls()
      return;
    }
  }
  // File was added or updated
  pictures.value.push(ref(null))
  emitValue()
  await updateUrls()
}
</script>
