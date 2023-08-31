<template>
  <!-- Content slot (shown if module is valid) -->
  <slot v-if="moduleValid" />

  <!-- Error card -->
  <q-card
    v-else
    class="bg-red-6 q-pa-md text-white text-center flex flex-center"
    style="min-width: 300px; height: 100px"
  >
    <strong>
      {{ $t('errors.module_error', { module }) }}
    </strong>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { i18n } from 'boot/i18n';
import { isModuleActive } from 'src/flox';

/**
 * This is a wrapper component to be used with Flox module components. It prevents the module's components from being
 * used without the corresponding module being active, since this could lead to erroneous behaviour.
 */

const props = defineProps<{
  module: string;
}>();

// Determines whether the given module is active (and shows an error otherwise)
const moduleValid = computed(() => {
  return isModuleActive(props.module);
});

// On mounted, throws an error that the module is not active
onMounted(() => {
  if (!moduleValid.value) {
    throw new Error(
      i18n.global.t('errors.module_error', { module: props.module })
    );
  }
});
</script>
