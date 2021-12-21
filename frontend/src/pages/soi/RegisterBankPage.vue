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
import {Address} from 'src/data/types/Address';
import GenericForm from 'components/forms/GenericForm.vue';
import {CREATE_BANK} from 'src/data/mutations/BANK';

const $routerService: RouterService|undefined = inject('$routerService')

/**
 * This component is a sign up form for banks.
 */

const initialFields = [
  FIELDS.FULL_NAME,
  FIELDS.ABBREVIATION,
  FIELDS.EMAIL,
  FIELDS.COMPANY_ADDRESS,
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
  // Addresses
  const addresses: Record<string, Address> = values.company_address as Record<string, Address>
  const address: Address = addresses.address

  // Sign up bank on database
  await executeMutation(
    CREATE_BANK,
    {
      first_name: values.full_name.first_name,
      last_name: values.full_name.last_name,
      abbreviation: values.abbreviation,
      address: address,
      email: values.email,
    }
  )

  // TODO: Admin must get popup with bank credentials here, so they can be sent via e-mail (not automatically)

  // Push to success page
  setTimeout(function() {
    void $routerService?.routeTo(ROUTES.LOGIN)
  }, 5000);
  await $routerService?.routeTo(ROUTES.SUCCESS)
}

</script>
