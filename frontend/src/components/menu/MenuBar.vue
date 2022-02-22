<template>
  <q-header class="row bg-transparent full-width">
    <div
      class="row justify-between full-width q-pa-sm"
      style="height: 90px"
    >
      <!-- Navigation -->
      <div
        class="column justify-start items-start"
      >
        <div
          v-for="option in navOptions"
          :key="option.key"
          class="row justify-start items-center"
        >
          <!-- Navigation root page -->
          <q-btn
            :label="option.label"
            flat
            no-caps
            :color="isActiveOption(option) ? 'black' : 'primary'"
            @click="onNavClick(option)"
          />

          <!-- Sub-navigation -->
          <div
            v-if="isActiveOption(option)"
            class="row justify-center"
          >
            <div
              v-for="(part, index) in routeParts.slice(1)"
              :key="part"
              class="row justify-center items-center"
            >
              <q-icon
                name="chevron_right"
                color="black"
                size="sm"
              />
              <q-btn
                :label="part.toUpperCase()"
                color="black"
                flat
                @click="onSubnavClick(index)"
              />
            </div>
          </div>
        </div>

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
import {useRoute, useRouter} from 'vue-router';

const authService: AuthenticationService|undefined = inject('$authService')
const routerService: RouterService|undefined = inject('$routerService')
const authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

const route = useRoute()
const router = useRouter()

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
    path: ROUTES.CUSTOMERS.path,
    label: i18n.global.tc('dashboard.customer', 0)
  },
  {
    key: 'account',
    path: ROUTES.ACCOUNT.path,
    label: i18n.global.t('dashboard.account')
  },
  {
    key: 'share',
    path: ROUTES.SHARE.path,
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

/**
 * Navigation options, depending on user type and whether they are logged in
 */
const navOptions = computed(() => {
  // Non-logged in users are not shown navigation
  if(!loggedIn.value){
    return []
  }

  return props.admin ? adminNavOptions : userNavOptions
})

/**
 * Parts of the route
 * e.g. ['usz', 'p123'] for route '/usz/p123'
 */
const routeParts = computed(() => {
  const pathParts = route.path.split('/')
  pathParts.splice(0, 1)
  return pathParts[0].length > 0 ? pathParts : []
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

/**
 * Determines whether a given navigation option is currently active
 * @param {Record<string, string>} option - navigation option
 * @returns {boolean} - whether it's active
 */
function isActiveOption(option: Record<string, string>){
  const pathParts = route.path.split('/')
  return `/${pathParts[1]}` === option.path
}

/**
 * Upon clicking a navigation main option, route to corresponding page
 * @param {Record<string, string>} option - navigation option that was clicked
 * @returns {Promise<void>} - done
 */
async function onNavClick(option: Record<string, string>){
  await router.push(option.path)
}

/**
 * Upon clicking a sub-navigation option, route to corresponding page
 * @param {number} index - index of the clicked option
 * @returns {Promise<void>} - done
 */
async function onSubnavClick(index: number){
  // Get amount of path items to remove (-2 to ignore root path)
  const diff = routeParts.value.length - index - 2

  console.log('Diff:', diff)
  // Last item clicked; no change needed
  if(diff === 0){
    return
  }

  // Build new target path by removing as many parts as needed
  let targetPath = ''
  for(let i = 0; i < routeParts.value.length - diff; i++){
    targetPath += `/${routeParts.value[i]}`
  }

  await router.push(targetPath)
}

</script>
