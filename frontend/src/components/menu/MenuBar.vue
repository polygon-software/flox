<template>
  <q-header class="row bg-transparent full-width">
  <div class="row justify-between full-width q-pa-sm">

    <!-- Navigation -->
    <div class="column">
      <q-btn
        v-for="option in navOptions"
        :key="option.key"
        :label="option.label"
        flat
        no-caps
        :color="isActiveOption(option) ? 'black' : 'primary'"
        @click="onNavClick(option)"
      />

      <!-- Logout button -->
      <q-btn
        v-if="loggedIn"
        :label="$t('authentication.logout')"
        color="primary"
        flat
        no-caps
        @click="logout"
      />
    </div>

    <div class="row justify-center">
      <!-- Logo -->
      <img
        alt="Ziegler Consultants"
        :src="require('src/assets/zc_logo.svg')"
        style="height: 50px"
        class="q-ma-sm"
      >
    </div>
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
import {i18n} from 'boot/i18n';
import {useRoute} from 'vue-router';

const authService: AuthenticationService|undefined = inject('$authService')
const routerService: RouterService|undefined = inject('$routerService')
const authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

const route = useRoute()

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

// Navigation options for admin
const adminNavOptions = [
  {
    key: 'customers',
    label: i18n.global.tc('dashboard.customer', 0)
  },
  {
    key: 'account',
    label: i18n.global.t('dashboard.account')
  },
  {
    key: 'share',
    label: i18n.global.t('dashboard.share')
  },
]

// TODO: navigation options for users
const userNavOptions = [
  {
    key: 'account',
    label: i18n.global.t('dashboard.account')
  },
]

// Depending on prop, show corresponding navigation options
const navOptions = props.admin ? adminNavOptions : userNavOptions

/**
 * Logs out the current authentication
 * @async
 * @returns {void}
 */
async function logout(): Promise<void>{
  await authService?.logout();
  await routerService?.routeTo(ROUTES.LOGIN)
}

/**
 * Determines whether a given navigation option is currently active
 * @param {Record<string, string>} option - navigation option
 * @returns {boolean} - whether it's active
 */
function isActiveOption(option: Record<string, string>){
  const routeParts = route.path.split('/')

  // TODO depths?
  return routeParts[1] === option.key
}

/**
 * Upon clicking a navigation option, route to corresponding page
 * @param {Record<string, string>} option - navigation option that was clicked
 * @returns {void}
 */
function onNavClick(option: Record<string, string>){
  // TODO navigate to corresponding route
  console.log('GOTO', option)
}

</script>
