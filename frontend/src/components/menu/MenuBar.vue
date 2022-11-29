<template>
  <q-header class="row bg-white shadow-5 justify-between">
    <div class="row">
      <img
        alt="Polygon Software"
        src="https://media-exp1.licdn.com/dms/image/C4D0BAQEI1LFXsM4DVA/company-logo_200_200/0/1593964710523?e=2159024400&v=beta&t=k1qIEpVNRq-GBvW1fZt2SKvcuq59WL8J0IuLW0qMSG4"
        style="height: 50px"
        class="q-ma-sm"
      />
      <h5 class="text-black q-pa-none q-ma-md">Flox Template</h5>
    </div>
    <div class="row">
      <q-btn
        v-if="loggedIn"
        :label="$t('authentication.logout')"
        class="text-primary"
        flat
        @click="logout"
      />
    </div>
  </q-header>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

import AuthenticationService from 'src/flox/modules/auth/services/auth.service';
import { useAuthStore } from 'src/flox/modules/auth/stores/auth.store';
import ROUTES from 'src/router/routes';
import RouterService from 'src/services/RouterService';

const $authService: AuthenticationService | undefined = inject('$authService');
const $routerService: RouterService | undefined = inject('$routerService');
const $authStore: ReturnType<typeof useAuthStore> = useAuthStore();

const loggedIn = computed(() => {
  // Explicit type
  const result: boolean = $authStore.loggedIn;
  return result;
});

/**
 * Logs out the current authentication
 *
 * @async
 */
async function logout(): Promise<void> {
  await $authService?.logout();
  await $routerService?.routeTo(ROUTES.LOGIN);
}
</script>
