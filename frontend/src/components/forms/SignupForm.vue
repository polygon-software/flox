<template>
  <div>
    <h5 class="q-mb-none" style="text-align: center; margin-bottom: 30px;">
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
import { i18n } from 'boot/i18n';
import {defineEmits} from 'vue';
import GenericForm from 'components/forms/GenericForm.vue';

/**
 * This component enables a multi-step sign up form using Quasar's q-stepper. In "form.pages.value" the different
 * steps are defined.The fields a page contains are defined in the fields variable.
 * Common fields can be found under "src/data/FIELDS".
 * All fields of a page must be completed before the next page can be accessed.
 */

const emit = defineEmits(['submit'])

const accountFields = [FIELDS.EMAIL, FIELDS.USERNAME, FIELDS.PASSWORD_REPEAT]

const pages = [
  {
    key: 'account_data',
    label: i18n.global.t('account_data.account'),
    fields: accountFields,
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
