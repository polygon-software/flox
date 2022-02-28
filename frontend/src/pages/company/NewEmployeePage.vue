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
import {CREATE_EMPLOYEE} from 'src/data/mutations/EMPLOYEE';
import {ErrorService} from 'src/services/ErrorService';

const $routerService: RouterService|undefined = inject('$routerService')
const $errorService: ErrorService|undefined = inject('$errorService')

/**
* This component allows the management to register new employees, the fields can easily be changed with the
* account_fields array. Once a new employee has been registered, the user will be redirected to the success page.
*/

const accountFields = [
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
    fields: accountFields,
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

  // Create account (automatically sends one-time login e-mail as well)
  try{
    await executeMutation(CREATE_EMPLOYEE, {
      first_name: formData.full_name.firstName,
      last_name: formData.full_name.lastName,
      gender: formData.salutation,
      phone: formData.phone_number,
      email: formData.email,
      function: formData.company_function.value,
      language: formData.language,
    });
    // Route back
    await $routerService?.routeTo(ROUTES.MANAGEMENT_EMPLOYEE_DATA)
  } catch(e) {
    $errorService?.showErrorDialog(e as Error)
  }
}

</script>
