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


  switch(props.valueType){
    case 'positive':
      styleClass += 'bg-green-2'
      break;
    case 'negative':
      styleClass += 'bg-red-2'
      break;
    case 'neutral':
      styleClass += 'bordered-card'
      break;
  }

  return styleClass
})

</script>

<style scoped>
.bordered-card{
  border: 1px solid lightgray;
}
</style>
