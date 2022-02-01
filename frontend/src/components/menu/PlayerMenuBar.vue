<template>
  <q-header class="row bg-primary shadow-5 justify-between">
    <div class="row">
      <img
          alt="Bigabig"
          :src="require('src/assets/bigabig-logo.svg')"
          style="height: 50px"
          class="q-ma-sm"
      >
    </div>
    <div class="row">
      <!-- Account options -->
      <q-badge
        v-if="notificationCount > 0"
        floating
        color="red"
        rounded
        style="margin: 10px 5px 0 0; z-index: 10"
      >
        {{notificationCount}}
      </q-badge>

      <q-btn-dropdown
        dropdown-icon="account_circle"
        size="xl"
        color="black"
        auto-close
        no-icon-animation
        flat
        round
        dense
        @click="showOptions = !showOptions"
      >
        <div class="column" style="width: 200px">
          <q-btn
            v-if="loggedIn"
            :label="$t('notifications.messages')"
            icon="notifications"
            color="black"
            class="text-black"
            flat
            no-caps
            style="width: 100%"
            @click="openInbox"
          >
            <q-badge
              v-if="notificationCount > 0"
              floating
              color="red"
              rounded
              style="height: 18px; margin: 13px 10px 0 0; z-index: 10"
            >
              {{notificationCount}}
            </q-badge>
          </q-btn>
          <q-btn
            v-if="loggedIn"
            :label="$t('authentication.logout')"
            icon="logout"
            color="black"
            class="text-black"
            flat
            no-caps
            style="width: 100%"
            @click="logout"
          />

          <q-btn
            v-if="loggedIn"
            :label="$t('authentication.change_password')"
            icon="lock"
            color="black"
            class="text-black"
            flat
            no-caps
            style="width: 100%"
            @click="changePassword"
          />
        </div>
      </q-btn-dropdown>
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
      <Inbox :notifications="notifications"/>
      <q-card-actions align="center">
        <q-btn
          :label="$t('buttons.back')"
          flat
          color="black"
          @click="closeInbox"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">
import {computed, inject, ref} from 'vue'
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
import { fetchMyNotifications } from 'src/helpers/api-helpers';


const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')
const $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

const loggedIn = computed(() => {
  // Explicit type
  return $authStore.getters.getLoggedInStatus();
})

const notifications = fetchMyNotifications()

// The number of notifications
const notificationCount = computed(() => {
  return notifications.value.filter(notification => !notification.isRead).length;
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
 * Triggers a password change for the currently logged in authentication
 * @returns {void}
 */
function changePassword() {
  $authService?.showChangePasswordDialog()
}

/*
* This section controls the visibility of the notification inbox popup.
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
