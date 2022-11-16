<template>
  <OnClickOutside @trigger="confirmed = false">
    <q-btn
      color="negative"
      :outline="!confirmed"
      :label="confirmed ? props.confirmLabel : props.label"
      no-caps
      v-bind="buttonProps"
      @click="confirmAction"
    />
  </OnClickOutside>
</template>

<script setup lang="ts">
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
