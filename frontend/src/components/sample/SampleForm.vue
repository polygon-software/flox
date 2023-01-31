<template>
  <FloxWrapper>
    <GenericForm
      form-key="sample"
      :pages="SampleFormPages"
      @submit="onSubmit"
    />
  </FloxWrapper>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

import GenericForm from '../../flox/modules/form/components/GenericForm.vue';
import { showSuccessNotification } from '../../flox/modules/form/helpers/notification-helpers';
import SampleFormPages from '../../flox/modules/form/data/form/SampleFormPages';
import FloxWrapper from '../../flox/core/components/FloxWrapper.vue';

/**
 * This is a sample form component that uses the GenericForm helper component.
 */

const $q = useQuasar();

/**
 * Emits the 'submit' event, containing the form's data
 * @param formValues - form inputs
 * @returns void
 */
function onSubmit(formValues: Record<string, string>): void {
  showSuccessNotification(
    $q,
    `You entered e-mail  '${formValues.email}', and username '${formValues.username}'`
  );
}
</script>
