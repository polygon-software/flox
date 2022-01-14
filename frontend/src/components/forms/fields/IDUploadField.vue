<template>
  <div class="row justify-between">
      <!-- Front of ID -->
      <q-file

        v-model="idFront"
        class="col id-preview"
        input-class="id-preview"
        outlined
        accept="image/*"
        :label="$t('account_data.passport_front')"
        stack-label
        clearable
        display-value=""
        :max-file-size="props.maxFileSize"
        :rules="[]"
        @update:model-value="onUpdate"
      >
        <img
          v-if="frontUrl"
          :src="frontUrl"
          alt="front"
          class="q-my-md"
          style="max-height: 150px"
        />
      </q-file>

      <!-- Back of ID -->
      <q-file
        v-model="idBack"
        class="col id-preview"
        input-class="id-preview"
        style="margin-left: 20px"
        outlined
        accept="image/*"
        :label="$t('account_data.passport_back')"
        stack-label
        clearable
        display-value=""
        :max-file-size="props.maxFileSize"
        :rules="[]"
        @update:model-value="onUpdate"
      >
        <img
          v-if="backUrl"
          :src="backUrl"
          alt="back"
          class="q-my-md"
          style="max-height: 150px"
        />
      </q-file>
    </div>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, Ref, ref} from 'vue';
import {toDataUrl} from 'src/helpers/image-helper';

/**
 * This component contains a field where Users must upload their ID (two files, front and back)
 */

const props = defineProps({
  maxFileSize: {
    type: Number,
    default: 5e7
  },
  initialValue: {
    type: Object,
    required: false,
    default: () => { return { front: null, back: null} }
  }
})

const emit = defineEmits(['change'])

// Files for ID front & back
const idFront: Ref<File|null> = ref(props.initialValue.front as File ?? null)
const idBack: Ref<File|null> = ref(props.initialValue.back as File ?? null)

// DataURLs for preview
const frontUrl: Ref<null|ArrayBuffer|string> = ref(null)
const backUrl: Ref<null|ArrayBuffer|string> = ref(null)


onMounted(async () => {
  // Update preview if an initial value is given
  if(idFront.value || idBack.value){
    await updatePreviewURLs()
  }
})

/**
 * Updates the preview URLs according to the picked/given file
 * @returns {Promise<void>} - done
 */
async function updatePreviewURLs(){
  // Update preview URLs
  frontUrl.value = idFront.value ? await toDataUrl(idFront.value) : null
  backUrl.value = idBack.value ? await toDataUrl(idBack.value) : null
}

/**
 * Emits an update if both files are present
 * @returns {void}
 */
async function onUpdate(){
  // Update URLs
  await(updatePreviewURLs())

  // Emit c hange
  emit('change', {
    front: idFront.value,
    back: idBack.value
  })
}

</script>

<style scoped>
.id-preview{
  width: 150px;
  height: 150px;
  margin-bottom: 24px
}
</style>
