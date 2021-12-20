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
        style="text-align: center"
      >
          <q-btn
            class="q-ma-md"
            flat
            color="primary"
            style="width: 400px"
            :label="$t('authentication.signup_now')"
            @click="toSignup"
          />
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

const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')


/**
 * Logs in the given authentication
 * @param {string} username - the authentication's username
 * @param {string} password - the authentication's password
 * @param {string} route_target - target route (only for demos)
 * @returns {void}
 */
async function onLogin({username, password, route_target}: {username: string, password: string, route_target: string}){
  await $authService?.login(username, password)
  const target_route_mapping: Record<string, RouteRecordRaw> = {
    'admin-dashboard': ROUTES.ADMIN_DASHBOARD,
    'management-dashboard': ROUTES.MANAGEMENT_EMPLOYEE_DATA,
    'employee-dashboard': ROUTES.EMPLOYEE_DASHBOARD
  }
  // Redirect to main page
  await $routerService?.routeTo(target_route_mapping[route_target])
}

/**
 * Routes to the Signup Page
 * @async
 * @returns {void}
 */
async function toSignup(): Promise<void>{
  await $routerService?.routeTo(ROUTES.SIGNUP)
}

</script>
