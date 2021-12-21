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
import {executeQuery} from 'src/helpers/data-helpers';
import {MY_USER} from 'src/data/queries/QUERIES';
import {User} from '../../../backend/src/modules/user/entities/user.entity';
import {ROLE} from 'src/data/ENUM/ENUM';

const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')


/**
 * Logs in the given authentication
 * @param {string} username - the authentication's username
 * @param {string} password - the authentication's password
 * @returns {void}
 */
async function onLogin({username, password}: {username: string, password: string}){
  await $authService?.login(username, password)
  const queryRes = await executeQuery(MY_USER)
  const user = queryRes.data[MY_USER.cacheLocation] as Record<string, unknown>
  if (!user){
    return
  }
  const role = user.role as ROLE
  console.log(user)
  const target_route_mapping: Record<ROLE, RouteRecordRaw> = {
    [ROLE.SOI_ADMIN]: ROUTES.ADMIN_DASHBOARD,
    [ROLE.COMPANY]: ROUTES.MANAGEMENT_EMPLOYEE_DATA,
    [ROLE.EMPLOYEE]: ROUTES.EMPLOYEE_DASHBOARD,
    [ROLE.SOI_EMPLOYEE]: ROUTES.WILDCARD,
    [ROLE.BANK]: ROUTES.WILDCARD,
    [ROLE.NONE]: ROUTES.WILDCARD,
  }
  // Redirect to main page
  await $routerService?.routeTo(target_route_mapping[role])
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
