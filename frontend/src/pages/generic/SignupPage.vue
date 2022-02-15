<template>
  <q-page class="flex flex-center">
    <!-- Signup Form -->
    <div class="q-pa-md q-ma-md">
      <SignupForm
        @submit="onSignup"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {inject, } from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import {RouterService} from 'src/services/RouterService';
import SignupForm from 'components/forms/SignupForm.vue'
import {executeMutation} from 'src/helpers/data-helpers';
import {CREATE_USER} from 'src/data/mutations/USER';
import ROUTES from 'src/router/routes';
import {ErrorService} from 'src/services/ErrorService';

const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')
const $errorService: ErrorService|undefined = inject('$errorService')

/**
 * Registers a new authentication using the given data and opens the corresponding e-mail verification dialog
 * @param {Record<string, string>} formValues - Signup form values
 * @returns {void}
 */
async function onSignup(formValues: Record<string, unknown>): Promise<void>{
  // Get params from form
  const username = formValues.username as string
  const email = formValues.email as string
  const phone = formValues.phone_number as string
  const password = formValues.password_repeat as string
  const fullName = formValues.full_name as string
  const birthdate = formValues.birthdate
  const address = formValues.address


  // Sign up via Cognito
  const cognitoId = await $authService?.signUp(username, email, password).catch((err: Error) => {
    $errorService?.showErrorDialog(err)
  });

  // Create user in backend
  await executeMutation(CREATE_USER, {
    createUserInput: {
      uuid: cognitoId,
      username,
      email,
      phone,
      fullName,
      birthdate,
      address
    }
  }).catch((err: Error) => {
    $errorService?.showErrorDialog(err)
  });

  // Reroute to generic success page
  await $routerService?.routeTo(ROUTES.SUCCESS)
}

</script>
