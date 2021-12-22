<template>
  <q-page class="flex flex-center">
    <div
      class="column q-pa-sm"
      style="width: 500px;"
    >
      <GenericForm
        :finish-label="$t('buttons.finish_signup')"
        :pages="pages"
        @submit="onSignup"
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
import {executeMutation} from 'src/helpers/data-helpers';
import GenericForm from 'components/forms/GenericForm.vue';
import {CREATE_BANK} from 'src/data/mutations/BANK';
import {QVueGlobals, useQuasar} from 'quasar';
import NewBankLoginDialog from 'components/dialogs/NewBankLoginDialog.vue'
import {FetchResult} from '@apollo/client';
import {randomPassword} from 'src/helpers/generator-helpers';

const $routerService: RouterService|undefined = inject('$routerService')
const $q: QVueGlobals = useQuasar()

/**
 * This component is a sign up form for banks.
 */

const initialFields = [
  FIELDS.FULL_NAME,
  FIELDS.COMPANY_NAME,
  FIELDS.ABBREVIATION,
  FIELDS.EMAIL,
  FIELDS.PHONE_NUMBER,
  FIELDS.ADDRESS,
]

const pages = [
  {
    key: 'name',
    label: i18n.global.t('authentication.signup'),
    fields: initialFields,
  },
]


/**
 * Upon valid sign-up, creates database entry
 * @param {Record<string, unknown>} values - form values
 * @async
 * @returns {void}
 */
async function onSignup(values: Record<string, Record<string, unknown>>){
  const pw = randomPassword(8)
  // Sign up bank on database
  const res = await executeMutation(
    CREATE_BANK,
    {
      first_name: values.full_name.first_name,
      last_name: values.full_name.last_name,
      name: values.company_name,
      phone: values.phone_number,
      abbreviation: values.abbreviation,
      address: values.address,
      email: values.email,
      password: pw,
    }
  )

  $q.dialog({
    component: NewBankLoginDialog,
    componentProps: {email: values.email, password: pw}
  }).onOk(() => {
    // Push to success page
    setTimeout(function () {
      void $routerService?.routeTo(ROUTES.ADMIN_BANK)
    }, 5000);
    void $routerService?.routeTo(ROUTES.SUCCESS)
  })


  // TODO: Admin must get popup with bank credentials here, so they can be sent via e-mail (not automatically)


}

</script>
