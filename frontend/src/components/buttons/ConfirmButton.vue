<template>
  <OnClickOutside @trigger="confirmed = false">
    <q-btn
      color="negative"
      :outline="!confirmed"
      :label="confirmed ? confirmLabel : label"
      no-caps
      @click="confirmAction"
      v-bind="buttonProps"
    />
  </OnClickOutside>
</template>

<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components';
import { QBtnProps } from 'quasar';
import { ref, Ref } from 'vue';

const props = defineProps<{
  label: string,
  confirmLabel: string,
  buttonProps: QBtnProps;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const confirmed: Ref<boolean> = ref(false);
function confirmAction() {
  if (confirmed.value == false) {
    confirmed.value = true;
  } else {
    confirmed.value = false;
    emit('click');
  }
}
</script>

<style scoped></style>
