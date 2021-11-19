<template>
  <strong>{{ $t('conditions') }}</strong>
  <embed
    :src="pdf_link"
    class="q-mt-md q-pa-md"
    frameBorder="0"
    scrolling="auto"
    height="500px"
    width="100%"
  />
  <q-field
    v-model="accept_conditions"
    :rules="[(val) => val === true || $t('must_accept_conditions')]"
    borderless
    dense
  >
    <template v-slot:control>
        <q-checkbox
          v-model="accept_conditions"
          :label="$t('accept_conditions')"
          @update:model-value="emitValue"
        />
    </template>
  </q-field>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue'
const emit = defineEmits(['change'])

const accept_conditions: Ref<boolean> = ref(false)
const show_error: Ref<boolean> = ref(false)
const pdf_link = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'

/**
 * Emits the picked value
 */
function emitValue(){
  if(accept_conditions.value){
    emit('change', accept_conditions.value)
  } else {
    show_error.value = true
  }
}
</script>
