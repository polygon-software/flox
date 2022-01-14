<template>
  <div class="q-pa-sm">
    <h5 class="q-mb-none" style="margin-bottom: 30px;">
      {{ $t('authentication.signup') }}
    </h5>
    <GenericForm
      :pages="pages"
      class="q-gutter-md"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { FIELDS } from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import { i18n } from 'boot/i18n';
import {defineEmits} from 'vue';
import GenericForm from 'components/forms/GenericForm.vue';

/**
 * This component enables a multi-step sign up form using Quasar's q-stepper. In "form.pages.value" the different
 * steps are defined.The fields a page contains are defined in the fields variable.
 * Common fields can be found under "src/data/FIELDS".
 * All fields of a page must be completed before the next page can be accessed.
 * TODO use GenericForm!
 */

const emit = defineEmits(['submit'])

const account_fields = [FIELDS.EMAIL, FIELDS.USERNAME, FIELDS.PASSWORD_REPEAT]
const personal_fields = [FIELDS.FULL_NAME, FIELDS.BIRTHDATE, FIELDS.PHONE_NUMBER, FIELDS.ID_UPLOAD]
const address_fields  = [FIELDS.ADDRESS]
const interest_fields = [FIELDS.INTERESTS]

const pages = [
  {
    key: 'account_data',
    label: i18n.global.t('account_data.account'),
    fields: account_fields,
  },
  {
    key: 'personal_data',
    label: i18n.global.t('account_data.personal'),
    fields: personal_fields,
  },
  {
    key: 'address_data',
    label: i18n.global.t('account_data.address'),
    fields: address_fields,
  },
  {
    key: 'interests',
    label: i18n.global.t('account_data.interests'),
    fields: interest_fields,
  },
]

/**
 * Emits the 'submit' event, containing the form's data
 * @param {Record<string, unknown>} values - form values
 * @returns {void}
 */
function onSubmit(values: Record<string, unknown>): void {
  emit('submit', values)
}

</script>
