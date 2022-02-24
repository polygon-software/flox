<template>
  <q-page class="flex flex-center">
    <div
      class="column items-center text-center"
    >
      <h5
        class="q-pa-sm q-ma-none"
      >
        {{ $t('greetings.welcome_datavis') }}</h5>
      <!-- Login Card -->
      <LoginForm
        class="row q-pa-md items-center"
        @submit="onLogin"
      />

      <q-btn
        :label="$t('authentication.forgot_password')"
        color="transparent"
        text-color="black"
        flat
        no-caps
        unelevated
        @click="forgotPassword"
      />

    </div>
  </q-page>
</template>

<script setup lang="ts">
import {inject,} from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import LoginForm from 'components/forms/LoginForm.vue';
import {ROLE} from 'src/data/ENUM';
import {executeQuery} from 'src/helpers/data-helpers';
import {MY_USER} from 'src/data/queries/USER';

const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')

/**
 * Logs in the given authentication
 * @param {string} username - the authentication's username
 * @param {string} password - the authentication's password
 * @async
 * @returns {void}
 */
async function onLogin({username, password}: {username: string, password: string}): Promise<void>{
  await $authService?.login(username, password)

  // Redirect to main page
  const queryResult = await executeQuery(MY_USER) as unknown as Record<string, Record<string, unknown>>

  const userData = queryResult.data.myUser as Record<string, unknown>
  const userName = userData.username as string;
  const userRole = userData.role as string;

  switch(userRole){
    case ROLE.USER:
      await $routerService?.routeTo(ROUTES.CUSTOMERS);
      await $routerService?.addToRoute(userName);
      break;
    case ROLE.ADMIN:
      await $routerService?.routeTo(ROUTES.CUSTOMERS);
      break;
    default:
      await $routerService?.routeTo(ROUTES.CUSTOMERS);
  }
}

/**
 * Triggers a password change for a non-logged in authentication
 * @returns {void}
 */
function forgotPassword() {
  $authService?.showResetPasswordDialog();
}

</script>
