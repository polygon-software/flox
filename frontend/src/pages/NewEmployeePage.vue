<template>
  <q-page class="flex flex-center">
    <div
      class="column q-pa-sm"
      style="width: 500px;"
    >
      <GenericForm
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

const $routerService: RouterService|undefined = inject('$routerService')

/**
* This component allows the management to register new employees, the fields can easily be changed with the
* account_fields array. Once a new employee has been registered, the user will be redirected to the success page.
*/

const account_fields = [
  FIELDS.SALUTATION,
  FIELDS.FULL_NAME,
  FIELDS.COMPANY_FUNCTION,
  FIELDS.PHONE_NUMBER,
  FIELDS.EMAIL,
]

const pages = [
  {
    key: 'company',
    label: i18n.global.t('employee_signup'),
    fields: account_fields,
  },
]


/**
 * Upon valid registration, creates database entry
 * @async
 */
async function onRegister(){
  //TODO: create database entry
  //TODO: redirect to something ?

  await $routerService?.routeTo(ROUTES.SUCCESS)
  return;
}

</script>
