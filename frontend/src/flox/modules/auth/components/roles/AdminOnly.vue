<template>
  <template v-if="$authStore.loggedIn && $authStore.isAdmin">
    <slot />
  </template>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';

const $authStore = useAuthStore();
</script>
