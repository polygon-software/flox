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
      :style="`width: 250px;margin: 12px 0 12px 0; height: ${caption ? '50px' : '40px'}`"
    >
      <div class="column">
        <strong v-if="bold">
          <q-tooltip v-if="showHoverText">
            {{ hoverText }}
          </q-tooltip>
          {{ content }}
        </strong>
        <p v-else>
          <q-tooltip v-if="showHoverText">
            {{ hoverText }}
          </q-tooltip>
          {{ content }}
        </p>
        <q-item-label v-if="caption" caption>
          {{ caption }}
        </q-item-label>
      </div>
    </q-card>
    <q-card
      v-if="secondContent"
      flat
      :class="computedClass"
      :style="`width: 250px;margin: 12px 0 12px 24px; height: ${caption ? '50px' : '40px'}`"
    >
      <div class="column">
        <strong v-if="bold">
          {{ secondContent }}
        </strong>
        <p v-else>
          {{ secondContent }}
        </p>
        <q-item-label v-if="secondCaption" caption>
          {{ secondCaption }}
        </q-item-label>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
/**
 * A summary field that can show either one or two values with a title, and optional captions
 */

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
  },
  caption: {
    type: String,
    required: false,
    default: null,
  },
  secondCaption: {
    type: String,
    required: false,
    default: null,
  },
  showHoverText: {
    type: Boolean,
    required: false,
    default: false,
  },
  hoverText: {
    type: String,
    required: false,
    default: null,
  },
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
