<template>
  <q-page class="flex flex-center">
    <q-card
      class="items-center text-center"
    >
      <h5
        class="q-pa-sm q-ma-none"
      >
        {{ $t('greetings.welcome_bigabig') }}</h5>
      <!-- Login Card -->
      <LoginForm
        v-if="!signup"
        class="row q-pa-md items-center"
        @submit="onLogin"
      />

      <strong
        v-if="!signup"
        style="margin-top: 0; padding: 0"
      >
        {{ $t('authentication.no_account_yet') }}
      </strong>

      <!-- Signup Card -->
      <q-card class="row q-pa-md q-ma-md justify-center flex items-center">
        <SignupForm
          v-if="signup"
          @submit="onSignup"
        >
        </SignupForm>
        <q-btn
          v-if="!signup"
          :label="$t('authentication.signup')"
          color="transparent"
          text-color="primary"
          flat
          rounded
          @click="signup = true"
        />
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject, ref, } from 'vue'
import {AuthenticationService} from '../services/AuthService';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import LoginForm from 'components/forms/LoginForm.vue'
import SignupForm from 'components/forms/SignupForm.vue'
import {executeMutation} from 'src/helpers/data-helpers';
import {CREATE_USER} from 'src/data/mutations/USER';

const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')

const signup = ref(false)


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
  await $routerService?.routeTo(ROUTES.MAIN)
}

/**
 * Registers a new authentication using the given data and opens the corresponding e-mail verification dialog
 * @param {Record<string, string>} formValues - Signup form values
 * @returns {void}
 */
async function onSignup(formValues: Record<string, string>): Promise<void>{
  // Get params from form
  const username = formValues.username
  const email = formValues.email
  const phone = formValues.phone_number
  const password = formValues.password_repeat
  const fullName = formValues.full_name
  const birthdate = formValues.birthdate
  const interests = formValues.interests
  const address = formValues.address

  // Sign up via Cognito
  const cognitoId = await $authService?.signUp(username, email, password);

  // Create user in backend
  await executeMutation(CREATE_USER, {
    createUserInput: {
      uuid: cognitoId,
      username,
      email,
      phone,
      fullName,
      birthdate,
      interests,
      address
    }
  })

  // TODO: close signup - make it a separate page, reroute to generic success page (can be copied from SOI)
}

</script>
