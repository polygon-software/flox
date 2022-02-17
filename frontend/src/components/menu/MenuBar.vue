<template>
  <q-header class="row bg-transparent full-width">
  <div class="row justify-between full-width q-pa-sm">
    <q-btn
        v-if="loggedIn"
        :label="$t('authentication.logout')"
        class="text-black"
        flat
        @click="logout"
    />
    <!-- Placeholder if not logged in -->
    <div v-else/>

    <q-chip v-if="admin" label="ADMIN MODE"/>

    <!-- Logo -->
    <img
      alt="Ziegler Consultants"
      :src="require('src/assets/zc_logo.svg')"
      style="height: 50px"
      class="q-ma-sm"
    >
  </div>
  </q-header>
</template>

<script setup lang="ts">
import {computed, inject, defineProps} from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {useAuth} from 'src/store/authentication';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';

const authService: AuthenticationService|undefined = inject('$authService')
const routerService: RouterService|undefined = inject('$routerService')
const authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

const props = defineProps({
  admin:  {
    type: Boolean,
    required: false,
    default: false,
  }
})

const loggedIn = computed(() => {
  // Explicit type
  return authStore.getters.getLoggedInStatus();
})

/**
 * Logs out the current authentication
 * @async
 * @returns {void}
 */
async function logout(): Promise<void>{
  await authService?.logout();
  await routerService?.routeTo(ROUTES.LOGIN)
}

</script>
