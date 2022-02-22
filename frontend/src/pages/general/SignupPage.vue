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
import { executeMutation, executeQuery } from 'src/helpers/data-helpers';
import { REGISTER_USER } from 'src/data/mutations/USER';
import ROUTES from 'src/router/routes';
import {ErrorService} from 'src/services/ErrorService';
import { EMAIL_ALLOWED } from 'src/data/queries/USER';

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
  const password = formValues.password_repeat as string

  const allowed = await executeQuery(EMAIL_ALLOWED, { email: email});

  if(!allowed?.data?.isEmailAllowed) {
    $errorService?.showErrorDialog(new Error(`Signup failed. The given email (${ email }) is not correct.`))
    return
  }

  // Sign up via Cognito
  const cognitoId = await $authService?.signUp(username, email, password).catch((err: Error) => {
    $errorService?.showErrorDialog(err)
  });

  // Create user in backend
  const res = await executeMutation(REGISTER_USER, {
    registerUserInput: {
      cognitoUuid: cognitoId,
      username,
      email,
    }
  }).catch((err: Error) => {
    $errorService?.showErrorDialog(err)
  });

  if(!res?.data?.register) {
    $errorService?.showErrorDialog(new Error(`Signup failed. Res: ${ res?.toString() ?? 'void' }`))
    return
  }
  try{
    await $authService?.showEmailVerificationDialog()
    await $authService?.login(username, password)
    await $routerService?.routeTo(ROUTES.CUSTOMERS) // TODO role-dependent
  }
  catch (e) {
    console.error(e)
    await $routerService?.routeTo(ROUTES.LOGIN)
  }

}

</script>
