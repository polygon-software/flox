<template>
  <slot v-if="moduleValid"/>
  <q-card v-else class="bg-negative q-pa-md text-white">
    {{ $t('error.module_error', {module}) }}
  </q-card>
</template>

<script setup lang="ts">
import {computed, defineProps, onMounted} from 'vue';
import {isModuleActive} from 'src/flox';

const props = defineProps({
  module: {
    type: String,
    required: true
  }
})

const moduleValid = computed(() => {
  return isModuleActive(props.module)
})

onMounted(() => {
  if(!moduleValid.value){
    throw new Error('blubb module')
  }
})

</script>
