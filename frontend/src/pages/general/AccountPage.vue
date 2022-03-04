<template>
  <q-page class="column items-center justify-start full-width">
      <!-- Title: Projects -->
      <h5>{{ $t('dashboard.account') }}</h5>
      <SignupForm
        @submit="onChange"
      />
  </q-page>
</template>

<script setup lang="ts">
import {inject, } from 'vue'
import SignupForm from 'components/forms/SignupForm.vue'
import { executeQuery } from 'src/helpers/data-helpers';
import {ErrorService} from 'src/services/ErrorService';
import { EMAIL_ALLOWED } from 'src/data/queries/USER';
import SuccessDialog from 'components/dialogs/SuccessDialog.vue';
import {useQuasar} from 'quasar';

const $errorService: ErrorService|undefined = inject('$errorService')
const $q = useQuasar()

/**
 * Updates an authentication using the given data
 * @param {Record<string, string>} formValues - form values
 * @returns {void}
 */
async function onChange(formValues: Record<string, unknown>): Promise<void>{
  // TODO: updates the data in backend
  // Get params from form
  const username = formValues.username as string
  const email = formValues.email as string
  const password = formValues.password_repeat as string

  const allowed = await executeQuery(EMAIL_ALLOWED, { email: email});

  if(!allowed?.data?.isEmailAllowed) {
    $errorService?.showErrorDialog(new Error(`Change the account data failed. The given email (${ email }) is not correct.`))
    return
  }

  //TODO: onOk
  $q.dialog({
    component: SuccessDialog,
    componentProps: {}
  })
}
</script>
