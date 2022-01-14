<template>
  <q-page class="flex flex-center">
    <!-- Signup Card -->
    <q-card class="row q-pa-md q-ma-md justify-center flex items-center">
      <SignupForm
        @submit="onSignup"
      />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject, } from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import {RouterService} from 'src/services/RouterService';
import SignupForm from 'components/forms/SignupForm.vue'
import {executeMutation} from 'src/helpers/data-helpers';
import {CREATE_USER} from 'src/data/mutations/USER';

const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')

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
