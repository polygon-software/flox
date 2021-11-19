<template>
  <q-page class="flex flex-center">
    <div
      class="column q-pa-sm"
      style="width: 500px;"
    >
      <GenericForm
        :finish_label="$t('finish_signup')"
        :form="form"
        :finish="() => onSignup"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { FIELDS } from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import {i18n} from 'boot/i18n';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {inject, ref} from 'vue';
import {executeMutation} from 'src/helpers/data-helpers';
import {CREATE_COMPANY} from 'src/data/mutations/COMPANY';
import {Address} from 'src/data/types/Address';
import GenericForm from 'components/forms/GenericForm.vue';

const $routerService: RouterService|undefined = inject('$routerService')

/**
 * This component enables a multi-step sign up form using Quasar's q-stepper. In "form.pages.value" the different
 * steps are defined.The fields a page contains are defined in the fields variable.
 * Common fields can be found under "src/data/FIELDS".
 * All fields of a page must be completed before the next page can be accessed.
 */

const account_fields = [
  FIELDS.FULL_NAME,
  FIELDS.LANGUAGE,
  FIELDS.COMPANY_ADDRESS,
  FIELDS.PHONE_NUMBER,
  FIELDS.EMAIL,
  FIELDS.COMPANY_DATA,
  FIELDS.CONDITIONS
]

const signup_form = ref(null)
const form = new Form()

form.pages.value = [
  {
    key: 'company',
    label: i18n.global.t('signup'),
    fields: account_fields,
  },
]


/**
 * Upon valid sign-up, creates database entry
 * @async
 */
async function onSignup(){
  // TODO verify AGBs checked

  console.log('OnSignup with arguments', form.values.value)

  const input: Record<string, Record<string, unknown>> = form.values.value

  // Addresses
  const addresses: Record<string, Address> = input.company_address as Record<string, Address>
  const domicile_address: Address = addresses.domicile_address
  const correspondence_address: Address = addresses.correspondence_address

  // TODO after cleanup
  await executeMutation(
    CREATE_COMPANY,
    {
      company_name: input.company_data.company_name,
      person_name: input.full_name,
      language: input.language,
      uid: input.company_data.uid,
      domicile_address: domicile_address,
      correspondence_address: correspondence_address,
      phone: input.phone_number,
      email: input.email,
      branch_structure: input.branch_structure
    }
  )
  await $routerService?.routeTo(ROUTES.SUCCESS)
  return;
}

</script>

<style scoped>

</style>
