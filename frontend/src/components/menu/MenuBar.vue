<template>
  <q-header class="row bg-primary shadow-5 justify-between">
    <div class="row">
      <img
          alt="Polygon Software"
          :src="require('src/assets/bigabig-logo.svg')"
          style="height: 50px"
          class="q-ma-sm"
      >
    </div>
    <div class="row items-center">
      <p
        class="text-black"
        v-if="loggedIn && username"
      >
        {{ $t('loggedIn', {user: username})}}
      </p>
    </div>

  <div class="row">
    <q-btn
        v-if="loggedIn"
        label="Logout"
        class="text-black"
        flat
        @click="logout"
    />
    <q-btn
        v-if="loggedIn"
        :label="$t('change_password')"
        class="text-black"
        flat
        @click="changePassword"
    />
    <q-btn
        v-if="!loggedIn"
        :label="$t('forgotten_password')"
        class="text-black"
        flat
        @click="forgottenPassword"
    />
    <div
      v-if="loggedIn"
      class="row items-center q-mr-md"
    >
      <q-btn
        round
        icon="notifications"
        color="black"
        style="width: 10px; height: 10px"
        @click="openInbox"
      >
        <q-badge
          floating
          color="red"
          rounded
        />
      </q-btn>
    </div>
  </div>
  </q-header>

  <!-- Notification Inbox -->
  <q-dialog
    v-model="showInbox"
    class="q-pa-xs"
  >
    <q-card
      style="overflow: hidden"
    >
      <Inbox db-ref="123"/>
      <q-card-actions align="center">
        <q-btn
          :label="$t('back')"
          flat
          color="black"
          @click="closeInbox"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">
import {computed, ComputedRef, inject, ref} from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {useAuth} from 'src/store/authentication';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';
import Inbox from 'components/notifications/Inbox.vue';


const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')
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
 * @async
 * @returns {void}
 */
async function logout(): Promise<void>{
  await $authService?.logout();
  await $routerService?.routeTo(ROUTES.LOGIN)
}

/**
 * Triggers a password change for the currently logged in authentication
 * @returns {void}
 */
function changePassword() {
  $authService?.showChangePasswordDialog()
}

/**
 * Triggers a password change for a non-logged in authentication
 * @returns {void}
 */
function forgottenPassword() {
  $authService?.showResetPasswordDialog();
}

/*
* This section controlls the visibility of the notification inbox popup.
*  TODO: Change it to a push or rerendering?
*/
const showInbox = ref(false)

/**
 * Opens the inbox
 * @returns {void}
 */
function openInbox() {
  showInbox.value = true
}

/**
 * Closes the inbox
 * @returns {void}
 */
function closeInbox() {
  showInbox.value = false
}
</script>
