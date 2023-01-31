<template>
  <FloxWrapper :module="MODULES.AUTH">
    <GenericForm
      form-key="sample"
      :pages="SampleFormPages"
      @submit="onSubmit"
    />
  </FloxWrapper>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

import { fetchByKey } from '../../flox/modules/form/helpers/form-helpers';
import { MODULES } from '../../flox/MODULES';
import GenericForm from '../../flox/modules/form/components/GenericForm.vue';
import { showSuccessNotification } from '../../flox/modules/form/helpers/notification-helpers';
import SampleFormPages from '../../flox/modules/form/data/form/SampleFormPages';
import FloxWrapper from '../../flox/core/components/FloxWrapper.vue';

/**
 * This is a sample form component that uses the GenericForm helper component.
 */

const $q = useQuasar();

/**
 * Fetches and logs the form's data from the store
 * @returns void
 */
function onSubmit(): void {
  const email = fetchByKey({
    formKey: 'signup',
    pageKey: 'signup',
    cardKey: 'signup',
    fieldKey: 'email',
  }) as string;

  const username = fetchByKey({
    formKey: 'signup',
    pageKey: 'signup',
    cardKey: 'signup',
    fieldKey: 'username',
  }) as string;
  showSuccessNotification(
    $q,
    `You entered e-mail  '${email}', and username '${username}'`
  );
}
</script>
