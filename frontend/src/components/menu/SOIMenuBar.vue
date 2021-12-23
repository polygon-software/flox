<template>
  <q-header class="row bg-black shadow-2 full-width">
    <q-toolbar class="full-width justify-between">
      <div class="row">
      <q-btn
        flat
        round
        dense
        icon="menu"
        @click="toggleDrawer"
      />
        <q-toolbar-title>
          SOI Chamäleon
        </q-toolbar-title>
        <q-chip
          v-if="admin"
          label="Admin"
          color="primary"
          text-color="white"
          :clickable="false"
          :ripple="false"
        />
      </div>

      <q-btn-dropdown
        dropdown-icon="more_vert"
        auto-close
        no-icon-animation
        flat
        round
        dense
        @click="showOptions = !showOptions"
      >
        <div class="column">
          <q-btn
            v-if="loggedIn"
            :label="$t('authentication.logout')"
            class="text-black"
            flat
            no-caps
            @click="logout"
          />

          <q-btn
            v-if="loggedIn"
            :label="$t('authentication.change_password')"
            class="text-black"
            flat
            no-caps
            @click="changePassword"
          />
        </div>
      </q-btn-dropdown>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import {computed, defineEmits, inject, ref} from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {useAuth} from 'src/store/authentication';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';
import {boolean} from 'joi';
const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')
const $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

const showDrawer = ref(true)
const emit = defineEmits(['toggle'])

const loggedIn = computed(() => {
  // Explicit type
  const result: boolean = $authStore.getters.getLoggedInStatus()
  return result;
})

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  admin: {
    type: boolean,
    required: false,
    default: false,
  }
})

/**
 * Logs out the current authentication
 * @async
 * @returns {void}
 */
async function logout(): Promise<void>{
  await $authService?.logout();
  await $routerService?.routeTo(ROUTES.LOGIN)
}


/**
 * Triggers a password change for the currently logged in user
 * @returns {void}
 */
function changePassword(): void {
  $authService?.showChangePasswordDialog()
}

/**
 * Toggles the left-hand drawer menu
 * @returns {void}
 */
function toggleDrawer(): void {
  showDrawer.value = !showDrawer.value
  emit('toggle', showDrawer)
}

</script>
