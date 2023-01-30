<template>
  <div class="column">
    <div class="row justify-between">
      <div :class="DEFAULT_LABEL_CLASS"  :style="DEFAULT_LABEL_STYLE">{{ label }}</div>
      <q-icon v-if="icon" name="info" class="text-primary">
        <q-tooltip>
          {{ tooltip }}
        </q-tooltip>
      </q-icon>
    </div>
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {DEFAULT_LABEL_CLASS, DEFAULT_LABEL_STYLE} from 'src/css/defaultStyles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  // Label text
  label: {
    type: String,
    required: true
  },
  // Icon name
  icon: {
    type: String,
    required: false,
    default: null,
  },
  // Tooltip for the icon
  tooltip: {
    type: String,
    required: false,
    default: null,
  },
})

</script>
