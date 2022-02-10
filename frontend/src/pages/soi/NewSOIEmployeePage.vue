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
import {executeMutation} from 'src/helpers/data-helpers';
import {ErrorService} from 'src/services/ErrorService';
import {CREATE_SOI_EMPLOYEE} from 'src/data/mutations/SOIEMPLOYEE';

const $routerService: RouterService|undefined = inject('$routerService')
const $errorService: ErrorService|undefined = inject('$errorService')

/**
* This component allows the management to register new employees, the fields can easily be changed with the
* account_fields array. Once a new employee has been registered, the user will be redirected to the success page.
*/

const accountFields = [
  FIELDS.SALUTATION,
  FIELDS.FULL_NAME,
  FIELDS.PHONE_NUMBER,
  FIELDS.EMAIL,
]

const pages = [
  {
    key: 'company',
    label: i18n.global.t('authentication.employee_signup'),
    fields: accountFields,
  },
]


/**
 * Upon valid registration, creates database entry
 * @param {Record<string, unknown>} formData: The form's entered data
 * @async
 * @returns {void}
 */
async function onRegister(formData: Record<string, Record<string, string>>){
  const email: string = formData.email.toString()
  if(email === null || email === undefined){
    $errorService?.showErrorDialog(new Error(i18n.global.t('errors.missing_attributes')))
  }

  // Create account (automatically sends one-time login e-mail as well)
  await executeMutation(CREATE_SOI_EMPLOYEE, {
    first_name: formData.full_name.firstName,
    last_name: formData.full_name.lastName,
    gender: formData.salutation,
    phone: formData.phone_number,
    email: formData.email,
  })

  // Route back
  await $routerService?.routeTo(ROUTES.ADMIN_EMPLOYEES)
}

</script>
