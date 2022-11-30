<template>
  <q-badge
    v-if="statusDisplay === 'pending'"
    outline
    color="grey"
    :label="$t('payment.pending')"
  />
  <q-badge
    v-if="statusDisplay === 'succeeded'"
    outline
    color="positive"
    :label="$t('payment.success')"
  />
  <q-badge
    v-if="statusDisplay === 'canceled'"
    outline
    color="negative"
    :label="$t('payment.error')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  status?: string;
}>();

const statusDisplay = computed(() => {
  if (props.status && ['canceled', 'succeeded'].includes(props.status)) {
    return props.status;
  }
  return 'pending';
});
</script>
