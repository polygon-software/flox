<template>
  <!-- Documents -->
  <q-file
    v-model="file"
    class="q-mb-md"
    outlined
    accept=".csv"
    :label="$t('documents.choose_file')"
    stack-label
    clearable
    :max-file-size="props.maxFileSize"
    :rules="[]"
    style="width: 250px"
    @update:model-value="emitValue"
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

const file: Ref<null|File> = ref(null)

/**
 * Emits the updated value
 * @returns {void}
 */
function emitValue(){
  emit('change', file.value)
}
</script>
