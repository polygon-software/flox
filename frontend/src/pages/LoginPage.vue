<template>
  <q-page class="flex flex-center">
    <q-card class="square q-pa-md q-ma-md">

      <!-- Login Card -->
      <q-card-section
        class="col"
      >
        <LoginForm @submit="onLogin"/>
      </q-card-section>

      <!-- Signup Card -->
      <q-card-section
        class="col">
        <div
          class="col content-center"
          style="width: 250px; text-align: center;"
        >
          <strong>
            {{ $t('authentication.signup_now') }}
          </strong>
          <br>
          <q-btn
            class="q-ma-md"
            style="width: 125px"
            :label="$t('authentication.signup')"
            color="primary"
            @click="toSignup"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import LoginForm from 'components/forms/LoginForm.vue'
import {inject} from 'vue'
import {AuthenticationService} from '../services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {RouteRecordRaw} from 'vue-router';

const $authService: AuthenticationService = inject('$authService')
const $routerService: RouterService = inject('$routerService')


/**
 * Logs in the given authentication
 * @param username {string} - the authentication's username
 * @param password {string} - the authentication's password
 * @param route_taget {string} - target route (only for demos)
 */
async function onLogin({username, password, route_target}: {username: string, password: string, route_target: string}){
  await $authService.login(username, password)
  const target_route_mapping: Record<string, RouteRecordRaw> = {
    'admin-dashboard': ROUTES.ADMIN_DASHBOARD,
    'management-dashboard': ROUTES.MANAGEMENT_DASHBOARD,
    'employee-dashboard': ROUTES.EMPLOYEE_DASHBOARD
  }
  // Redirect to main page
  await $routerService.routeTo(target_route_mapping[route_target])
}

/**
 * Routes to the Signup Page
 * @async
 * @returns {void}
 */
async function toSignup(): Promise<void>{
  await $routerService.routeTo(ROUTES.SIGNUP)
}

</script>
