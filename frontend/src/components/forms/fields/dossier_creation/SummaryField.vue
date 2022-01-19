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
      style="width: 250px; height: 40px; margin: 12px 0 12px 0"
    >
      <strong v-if="bold">
        {{ content }}
      </strong>
      <p v-else>
        {{ content }}
      </p>
    </q-card>
    <q-card
      v-if="secondContent"
      flat
      :class="computedClass"
      style="width: 250px; height: 40px; margin: 12px 0 12px 24px"
    >
      <strong v-if="bold">
        {{ secondContent }}
      </strong>
      <p v-else>
        {{ secondContent }}
      </p>
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
  },
  secondContent: {
    type: String,
    required: false,
    default: null
  },
  bold: {
    type: Boolean,
    required: false,
    default: false,
  }
})

/**
 * CSS Class to apply on the card(s)
 */
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
