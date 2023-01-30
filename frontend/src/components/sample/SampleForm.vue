<template>
  <GenericForm :pages="pages" @submit="onSubmit" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { FormPage } from 'src/flox/modules/form/components/MultiPageForm.vue';

import GenericForm from 'src/flox/modules/form/components/GenericForm.vue';
import { EMAIL, USERNAME } from 'src/flox/modules/auth/components/forms/fields';
import { showSuccessNotification } from 'src/tools/notification.tool';

/**
 * This is a sample form component that uses the GenericForm helper component.
 */

const $q = useQuasar();

const fields = [EMAIL, USERNAME];

const pages = [
  {
    key: 'sample',
    label: 'Sample',
    fields,
  },
] as FormPage[];

/**
 * Emits the 'submit' event, containing the form's data
 *
 * @param formValues - form inputs
 */
function onSubmit(formValues: Record<string, string>): void {
  showSuccessNotification(
    $q,
    `You entered e-mail  '${formValues.email}', and username '${formValues.username}'`
  );
}
</script>
