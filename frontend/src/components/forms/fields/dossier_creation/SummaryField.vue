<template>
  <div class="row items-center">
    <q-item-label
      style="width: 250px"
    >
      {{ label }}
    </q-item-label>
    <q-card
      flat
      :class="computedClass"
      style="width: 250px; margin: 12px 0 12px 0"
    >
      <b>
        {{ content }}
      </b>
    </q-card>
  </div>
</template>

<script setup lang="ts">

import {computed, PropType} from 'vue';

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  valueType: {
    type: () => 'positive'|'negative'|'neutral' as PropType<string>,
    required: false,
    default: 'neutral',
  }
})

const computedClass = computed(() => {
  let styleClass = 'q-pa-sm text-right '

  if(props.valueType === 'positive'){
    styleClass += 'bg-green-2'
  } else if(props.valueType === 'negative'){
    styleClass += 'bg-red-2'
  }

  return styleClass
})

</script>

<style scoped>

</style>
