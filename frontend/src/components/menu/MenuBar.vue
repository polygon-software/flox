<template>
  <q-header class="row bg-white shadow-5 justify-between">
    <div class="row">
      <img
          alt="Polygon Software"
          src="https://media-exp1.licdn.com/dms/image/C4D0BAQEI1LFXsM4DVA/company-logo_200_200/0/1593964710523?e=2159024400&v=beta&t=k1qIEpVNRq-GBvW1fZt2SKvcuq59WL8J0IuLW0qMSG4"
          style="height: 50px"
          class="q-ma-sm"
      >
      <h5 class="text-black q-pa-none q-ma-md">
        PolygonSoftware Template
      </h5>
      <p
          class="text-grey-7"
          v-if="loggedIn && username"
      >
        {{ $t('loggedIn', {user: username})}}
      </p>
    </div>
  <div class="row">
    <q-btn
        v-if="loggedIn"
        label="Logout"
        class="text-primary"
        flat
        @click="logout"
    />
    <q-btn
        v-if="loggedIn"
        label="Change Password"
        class="text-primary"
        flat
        @click="changePassword"
    />
    <q-btn
        v-if="!loggedIn"
        label="Password Forgotten"
        class="text-primary"
        flat
        @click="forgottenPassword"
    />
  </div>

  </q-header>
</template>

<script setup lang="ts">
import {computed, inject} from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {useAuth} from 'src/store/authentication';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';


const $authService: AuthenticationService = inject('$authService')
const $routerService: RouterService = inject('$routerService')
const $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

const loggedIn = computed(() => {
  // Explicit type
  const result: boolean = $authStore.getters.getLoggedInStatus()
  return result;
})

// Username does not need to be reactive, since it won't change between logins
const username = $authStore.getters.getUsername()

/**
 * Logs out the current authentication
 */
async function logout(): Promise<void>{
  await $authService.logout();
  await $routerService.routeTo(ROUTES.LOGIN)
}

/**
 * Triggers a password change for the currently logged in authentication
 */
function changePassword() {
  $authService.showChangePasswordDialog()
}

/**
 * Triggers a password change for a non-logged in authentication
 */
function forgottenPassword() {
  $authService.showResetPasswordDialog();
}

</script>
