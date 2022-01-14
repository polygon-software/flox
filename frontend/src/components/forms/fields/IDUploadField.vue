<template>
  <div>
    TODO
  </div>
</template>

<script setup lang="ts">

import {defineEmits, Ref, ref, watch} from 'vue';

/**
 * This component contains a field where Users must upload their ID (two files, front and back)
 */

let idFront: Ref<File|null> = ref(null)
let idBack: Ref<File|null> = ref(null)

const emit = defineEmits(['change'])

/**
 * Emits an update if both files are present
 * @returns {void}
 */
function emitUpdate(){
  if(idFront.value && idBack.value){
    emit('change', {
      front: idFront.value,
      back: idBack.value
    })
  } else {
    // Empty emit (input not valid)
    emit('change', {})
  }
}

</script>

<style scoped>

</style>
