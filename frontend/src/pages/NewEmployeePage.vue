<template>
  <q-page class="flex flex-center">
    <div
      class="column q-pa-sm"
      style="width: 500px;"
    >
      <GenericForm
        :finish-label="$t('buttons.finish_signup')"
        :pages="pages"
        @submit="onRegister"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { FIELDS } from 'src/data/FIELDS';
import {i18n} from 'boot/i18n';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {inject} from 'vue';
import GenericForm from 'components/forms/GenericForm.vue';
import {executeMutation, executeQuery} from 'src/helpers/data-helpers';
import {CREATE_EMPLOYEE} from 'src/data/mutations/EMPLOYEE';
import {sendPasswordChangeEmail} from 'src/helpers/email-helpers';
import {AuthenticationService} from 'src/services/AuthService';
import {ErrorService} from 'src/services/ErrorService';
import {randomPassword} from 'src/helpers/generator-helpers';
import {MY_USER} from 'src/data/queries/QUERIES';

const $routerService: RouterService|undefined = inject('$routerService')
const $authService: AuthenticationService|undefined = inject('$authService')
const $errorService: ErrorService|undefined = inject('$errorService')

/**
* This component allows the management to register new employees, the fields can easily be changed with the
* account_fields array. Once a new employee has been registered, the user will be redirected to the success page.
*/

const account_fields = [
  FIELDS.SALUTATION,
  FIELDS.FULL_NAME,
  FIELDS.LANGUAGE,
  FIELDS.COMPANY_FUNCTION,
  FIELDS.PHONE_NUMBER,
  FIELDS.EMAIL,
]

const pages = [
  {
    key: 'company',
    label: i18n.global.t('authentication.employee_signup'),
    fields: account_fields,
  },
]


/**
 * Upon valid registration, creates database entry
 * @param {Record<string, unknown>} formData: The form's entered data
 * @returns {Promise<void>} - done
 */
async function onRegister(formData: Record<string, Record<string, string>>){
  const email: string|null  = formData.email.toString()
  if(!email || email.length === 0){
    $errorService?.showErrorDialog(new Error(i18n.global.t('errors.missing_attributes')))
  }

  // Create database entry
  await executeMutation(CREATE_EMPLOYEE, {
    first_name: formData.full_name.first_name,
    last_name: formData.full_name.last_name,
    gender: formData.salutation,
    phone: formData.phone_number,
    email: formData.email,
    function: formData.company_function,
    language: formData.language,
  })

  // Route back
  await $routerService?.routeTo(ROUTES.MANAGEMENT_EMPLOYEE_DATA)
}

</script>
