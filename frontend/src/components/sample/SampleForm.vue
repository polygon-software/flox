<template>
  <GenericForm
    :pages="pages"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import {FIELDS} from 'src/flox/modules/auth/components/forms/fields';
import GenericForm from 'components/forms/GenericForm.vue';
import {showSuccessNotification} from 'src/tools/notification.tool';
import {useQuasar} from 'quasar';

/**
 * This is a sample form component that uses the GenericForm helper component.
 */

const $q = useQuasar()

const fields = [
  FIELDS.EMAIL,
  FIELDS.USERNAME,
]

const pages = [
  {
    key: 'sample',
    label: 'Sample',
    fields: fields
  }
]

/**
 * Emits the 'submit' event, containing the form's data
 * @param {Record<string, string>} formValues - form inputs
 * @returns {void}
 */
function onSubmit(formValues: Record<string, string>): void {
  showSuccessNotification(
    $q,
    `You entered e-mail  '${formValues.email}', and username '${formValues.username}'`,
  )
}
</script>
