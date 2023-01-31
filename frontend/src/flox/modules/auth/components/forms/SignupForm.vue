<template>
  <FloxWrapper :module="MODULES.AUTH">
    <div class="column q-pa-sm text-center justify-center" style="margin: 50px">
      <GenericForm
        form-key="signup"
        :pages="SignupFormPages"
        text-position="center"
        :finish-label="$t('buttons.login')"
        submit-on-enter
        @submit="onSignup"
      />
    </div>
  </FloxWrapper>
</template>

<script setup lang="ts">
import FloxWrapper from '../../../../core/components/FloxWrapper.vue';
import { MODULES } from '../../../../MODULES';
import * as auth from '../..';
import SignupFormPages from '../../../form/data/form/SignupFormPages';
import GenericForm from '../../../form/components/GenericForm.vue';
import { fetchByKey } from '../../../form/helpers/form-helpers';
import { useFormStore } from '../../../form/stores/form';

const store = useFormStore();

/**
 * Finishes the signup process with the data saved in the store.
 * @returns void
 */
function onSignup(): void {
  if (auth.moduleConfig().emailAsUsername) {
    const email = fetchByKey({
      formKey: 'signup',
      pageKey: 'signup',
      cardKey: 'signup',
      fieldKey: 'email',
    }) as string;

    const password = fetchByKey({
      formKey: 'signup',
      pageKey: 'signup',
      cardKey: 'signup',
      fieldKey: 'password',
    }) as string;

    // TODO: do the signup
    // eslint-disable-next-line no-console
    console.log(email, password);
  } else {
    const username = fetchByKey({
      formKey: 'signup',
      pageKey: 'signup',
      cardKey: 'signup',
      fieldKey: 'username',
    }) as string;

    const email = fetchByKey({
      formKey: 'signup',
      pageKey: 'signup',
      cardKey: 'signup',
      fieldKey: 'email',
    }) as string;

    const password = fetchByKey({
      formKey: 'signup',
      pageKey: 'signup',
      cardKey: 'signup',
      fieldKey: 'password',
    }) as string;

    // TODO: do the signup
    // eslint-disable-next-line no-console
    console.log(username, email, password);
  }
  // Empty store state
  store.clearForm('login');
}
</script>
