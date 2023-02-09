<template>
  <FloxWrapper :module="MODULES.AUTH">
    <div class="column q-pa-sm text-center justify-center">
      <GenericForm
        :form-key="signupFormKey.formKey"
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
import { FIELDS } from '../../../form/data/form/FIELDS';
import FloxWrapper from '../../../../core/components/FloxWrapper.vue';
import * as auth from '../..';
import SignupFormPages from '../../../form/data/form/SignupFormPages';
import GenericForm from '../../../form/components/GenericForm.vue';
import { fetchByKey } from '../../../form/helpers/form-helpers';
import { useFormStore } from '../../../form/stores/form';
import { loginFormKey, signupFormKey } from '../../../form/data/form/FormKeys';
import COUNTRY_CODES from '../../../../COUNTRIES';
import { MODULES } from '../../../../MODULES';

const emit = defineEmits<{
  (
    e: 'submit',
    value: {
      username: string;
      email: string;
      password: string;
      language?: string;
    }
  ): void;
}>();

const store = useFormStore();

/**
 * Emit the
 * @returns void
 */
function onSignup(): void {
  const email = fetchByKey({
    ...signupFormKey,
    fieldKey: FIELDS.EMAIL.key,
  }) as string;

  const password = fetchByKey({
    ...signupFormKey,
    fieldKey: FIELDS.PASSWORD_REPEAT.key,
  }) as string;

  const language =
    (
      fetchByKey({
        ...loginFormKey,
        fieldKey: FIELDS.SELECT_LANGUAGE.key,
      }) as COUNTRY_CODES
    ).toLowerCase() ?? undefined;

  if (auth.moduleConfig().emailAsUsername) {
    emit('submit', { username: email, email, password, language });
  } else {
    const username = fetchByKey({
      ...signupFormKey,
      fieldKey: FIELDS.USERNAME.key,
    }) as string;

    emit('submit', { username, email, password, language });
  }
  // Empty store state
  store.clearForm(signupFormKey.formKey);
}
</script>
