<template>
  <q-header class="row flex items-center bg-primary shadow-5 no-wrap">
    <div class="col flex justify-start">
      <img
        alt="Bigabig"
        :src="require('src/assets/bigabig-logo.svg')"
        style="height: 50px"
        class="q-ma-sm cursor-pointer"
        @click="goHome"
      >
      <q-btn
        icon="menu"
        flat
        color="black"
        @click="toggleMenu"
      />
      <h5 class="text-black q-ma-none q-pa-md">
        {{ $t('dashboards.admin_dashboard') }}
      </h5>
    </div>

    <!-- Search field -->
    <div class="col flex justify-center"
    >
      <SeachBar v-if="$routerService?.route.path === '/'"/>
    </div>

    <div class="col q-mr-md flex justify-end">
      <!-- TODO: Avatar should be fetched from user-->
      <q-avatar
        icon="account_circle"
        text-color="black"
        font-size="48px"
        size="xl"
        style="cursor: pointer;"
        rounded
        @click="showOptions = !showOptions"
      >
        <!-- Notifications -->
        <q-badge
          v-if="notificationCount > 0"
          floating
          color="red"
          rounded
          style="margin: 10px 0 0 0; z-index: 10"
        >
          {{notificationCount}}
        </q-badge>

        <!-- Account Options -->
        <q-menu
          :offset="[10, 7]"
          style="width: 250px;"
        >
          <q-list>
            <q-item>
              <q-btn
                v-if="loggedIn"
                :label="$t('notifications.messages')"
                icon="notifications"
                color="black"
                class="text-black"
                flat
                no-caps
                align="left"
                @click="openInbox"
              >
                <q-badge
                  v-if="notificationCount > 0"
                  floating
                  color="red"
                  rounded
                  style="height: 18px; width: 18px; margin: 13px 10px 0 0; z-index: 10"
                >
                  {{notificationCount}}
                </q-badge>
              </q-btn>
            </q-item>
            <q-item>
              <q-btn
                v-if="loggedIn"
                :label="$t('authentication.change_password')"
                icon="lock"
                color="black"
                class="text-black"
                flat
                no-caps
                align="left"
                @click="changePassword"
              />
            </q-item>
            <q-item>
              <q-btn
                v-if="loggedIn"
                :label="$t('authentication.logout')"
                icon="logout"
                color="black"
                class="text-black"
                flat
                no-caps
                align="left"
                @click="logout"
              />
            </q-item>
          </q-list>
        </q-menu>
      </q-avatar>
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
      <Inbox :messages="myNotifications"/>
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
import { computed, inject, ref, defineEmits } from 'vue';
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
import SeachBar from 'components/menu/MenuSeachBar.vue';

const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')
const $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

const emit = defineEmits(['toggleMenu'])

const showOptions = ref(false)
const loggedIn = computed(() => {
  // Explicit type
  return $authStore.getters.getLoggedInStatus();
})

/**
 * Go to main page.
 * @returns {Promise<void>} - async
 */
async function goHome(): Promise<void> {
  await $routerService?.routeTo(ROUTES.MAIN);
}

const myNotifications = fetchMyNotifications()

// The number of notifications
const notificationCount = computed(() => {
  return myNotifications.value.filter(notification => !notification.isRead).length;
});

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
 * Toggles the menu by emitting an event
 * @returns {void}
 */
function toggleMenu(){
  emit('toggleMenu')
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
