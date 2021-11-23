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
            {{ $t('signup_now') }}
          </strong>
          <br>
          <q-btn
            class="q-ma-md"
            style="width: 125px"
            :label="$t('signup')"
            color="primary"
            @click="toSignup"
          />
        </div>
      </q-card-section>
    </q-card>
    <q-card class="q-pa-md">
      <FileUploadForm :pages="pages"/>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import LoginForm from 'components/forms/LoginForm.vue'
import {inject} from 'vue'
import {AuthenticationService} from '../services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import FileUploadForm from 'components/forms/FileUploadForm.vue';
import {FIELDS} from "src/data/FIELDS";
import {i18n} from "boot/i18n";
const $authService: AuthenticationService = inject('$authService')
const $routerService: RouterService = inject('$routerService')


/**
 * Logs in the given authentication
 * @param username {string} - the authentication's username
 * @param password {string} - the authentication's password
 */
async function onLogin({username, password}: {username: string, password: string}){
  await $authService.login(username, password)

  // Redirect to main page
  await $routerService.routeTo(ROUTES.MAIN)
}

/**
 * Routes to the Signup Page
 */
async function toSignup(): Promise<void>{
  await $routerService.routeTo(ROUTES.SIGNUP)
  return;
}


const account_fields = [
  FIELDS.FILE_UPLOAD,
]

const pages = [
  {
    key: 'file_upload',
    label: i18n.global.t('file_upload'),
    fields: account_fields,
  },
]
</script>
