<template>
  <GenericForm
    :pages="pages"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import GenericForm from 'components/forms/GenericForm.vue';
import {showNotification} from 'src/helpers/tools/notification-helpers';
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
  showNotification(
    $q,
    `You entered e-mail  '${formValues.email}', and username '${formValues.username}'`,
    'bottom',
    'positive'
  )
}
</script>
