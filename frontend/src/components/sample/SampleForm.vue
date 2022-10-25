<template>
  <GenericForm :pages="pages" @submit="onSubmit" />
</template>

<script setup lang="ts">
import { EMAIL, USERNAME } from 'src/flox/modules/auth/components/forms/fields';
import GenericForm from 'components/forms/GenericForm.vue';
import { showSuccessNotification } from 'src/tools/notification.tool';
import { useQuasar } from 'quasar';
import { FormPage } from 'components/forms/MultiPageForm';

/**
 * This is a sample form component that uses the GenericForm helper component.
 */

const $q = useQuasar();

const fields = [EMAIL, USERNAME];

const pages = [
  {
    key: 'sample',
    label: 'Sample',
    fields: fields,
  },
] as FormPage[];

/**
 * Emits the 'submit' event, containing the form's data
 * @param formValues - form inputs
 */
function onSubmit(formValues: Record<string, string>): void {
  showSuccessNotification(
    $q,
    `You entered e-mail  '${formValues.email}', and username '${formValues.username}'`
  );
}
</script>
