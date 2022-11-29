<template>
  <template v-if="$authStore.loggedIn">
    <slot />
  </template>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';

const $authStore = useAuthStore();
</script>
