<template>
  <GenericForm
    :form-key="sampleFormKey.formKey"
    :pages="SampleFormPages"
    @submit="onSubmit"
  />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';

import { fetchByKey } from 'src/flox/modules/form/helpers/form-helpers';
import { showSuccessNotification } from 'src/flox/modules/form/helpers/notification-helpers';
import { sampleFormKey } from 'src/flox/modules/form/data/FORM_KEYS';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';
import { useFormStore } from 'src/flox/modules/form/stores/form';

import SampleFormPages from '../../flox/modules/form/data/formPages/SampleFormPages';
import GenericForm from '../../flox/modules/form/components/GenericForm.vue';

/**
 * This is a sample form component that uses the GenericForm helper component.
 */

const $q = useQuasar();
const store = useFormStore();

/**
 * Fetches and logs the form's data from the store
 * @returns void
 */
function onSubmit(): void {
  const email = fetchByKey({
    ...sampleFormKey,
    fieldKey: FIELDS.EMAIL.key,
  }) as string;

  const username = fetchByKey({
    ...sampleFormKey,
    fieldKey: FIELDS.USERNAME.key,
  }) as string;
  showSuccessNotification(
    $q,
    `You entered e-mail  '${email}', and username '${username}'`
  );
  // Empty store state
  store.clearForm(sampleFormKey.formKey);
}
</script>
