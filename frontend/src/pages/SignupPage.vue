<template>
  <q-page class="flex flex-center column">
    <!-- Signup Card -->
    <q-card class="q-pa-md q-ma-md" style="width: 300px">
      <SignupForm
        @submit="onSignup"
        @cancel="onCancel"
      />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject} from 'vue'
import {AuthenticationService} from '../flox/modules/auth/services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import SignupForm from 'src/flox/modules/auth/components/forms/SignupForm.vue';
import {showNotification} from 'src/helpers/notification-helpers';
import {useQuasar} from 'quasar';
import {i18n} from 'boot/i18n';

const $q = useQuasar()
const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')

/**
 * Logs in the given authentication
 * @param {string} username - the authentication's username (may be identical to the e-mail)
 * @param {string} email - the authentication's email
 * @param {string} password - the authentication's password
 * @returns {void}
 */
async function onSignup({username, email, password}: {username: string, email: string, password: string}){
  await $authService?.signUp(username, email, password)

  // Show success notification
  showNotification(
    $q,
    i18n.global.t('messages.account_created'),
    'bottom',
    'positive'
  )

  // Redirect to login page
  await $routerService?.routeTo(ROUTES.LOGIN)
}

/**
 * On cancel, routes back to login page
 * @returns {Promise<void>} - done
 */
async function onCancel() {
  await $routerService?.routeTo(ROUTES.LOGIN)
}
</script>
