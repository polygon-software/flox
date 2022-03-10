<template>
  <q-page class="column items-center justify-start full-width">
      <!-- Title: Projects -->
      <h5>{{ $t('dashboard.account') }}</h5>
      <AccountForm
        @submit="onChange"
      />
  </q-page>
</template>

<script setup lang="ts">
import {inject, } from 'vue'
import SuccessDialog from 'components/dialogs/SuccessDialog.vue';
import {useQuasar} from 'quasar';
import AccountForm from 'components/forms/AccountForm.vue';
import {RouterService} from 'src/services/RouterService';

const $q = useQuasar()
const routerService: RouterService|undefined = inject('$routerService')

/**
 * Updates an authentication using the given data
 * @param {Record<string, string>} formValues - form values
 * @returns {void}
 */
function onChange(formValues: Record<string, unknown>): void{
  // TODO: updates the data in backend
  // Get params from form
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const email = formValues.email as string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const username = formValues.username as string

  //TODO: check if email and username does not exist in the database and update the changes

  //TODO: onOk
  $q.dialog({
    component: SuccessDialog,
    componentProps: {routerService: routerService}
  })
}
</script>
