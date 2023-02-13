<template>
  <GenericForm
    :form-key="sampleFormKey.formKey"
    :pages="SampleFormPages"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

import { fetchByKey } from '../../flox/modules/form/helpers/form-helpers';
import GenericForm from '../../flox/modules/form/components/GenericForm.vue';
import { showSuccessNotification } from '../../flox/modules/form/helpers/notification-helpers';
import SampleFormPages from '../../flox/modules/form/data/formPages/SampleFormPages';
import { sampleFormKey } from '../../flox/modules/form/data/FORM_KEYS';
import { FIELDS } from '../../flox/modules/form/data/FIELDS';
import { useFormStore } from '../../flox/modules/form/stores/form';

/**
 * This is a sample formPages component that uses the GenericForm helper component.
 */

const $q = useQuasar();
const store = useFormStore();

/**
 * Fetches and logs the formPages's data from the store
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
