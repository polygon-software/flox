<template>
  <OnClickOutside class="column" @trigger="confirmed = false">
    <q-btn
      :label="confirmed ? confirmLabel : label"
      :outline="confirmed"
      v-bind="buttonProps"
      @click="confirmAction"
    />
  </OnClickOutside>
</template>

<script lang="ts" setup>
import { OnClickOutside } from '@vueuse/components';
import { QBtnProps } from 'quasar';
import { ref, Ref } from 'vue';

const props = defineProps<{
  label: string;
  confirmLabel: string;
  buttonProps: QBtnProps;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const confirmed: Ref<boolean> = ref(false);

/**
 * On button click, change state or emit
 */
function confirmAction(): void {
  if (!confirmed.value) {
    confirmed.value = true;
  } else {
    confirmed.value = false;
    emit('click');
  }
}
</script>
