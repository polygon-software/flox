<template>
  <template v-if="$authStore.loggedIn && $authStore.role === role">
    <slot />
  </template>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';

const props = defineProps<{
  role: string;
}>();

const $authStore = useAuthStore();
</script>
