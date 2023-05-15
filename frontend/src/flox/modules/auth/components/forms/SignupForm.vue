<template>
  <FloxWrapper :module="MODULES.AUTH">
    <div class="column q-pa-sm text-center justify-center">
      <GenericForm
        :finish-label="$t('authentication.signup')"
        :form-key="signupFormKey.formKey"
        :pages="SignupFormPages"
        text-position="center"
        @submit="onSubmit"
      />
    </div>
  </FloxWrapper>
</template>

<script lang="ts" setup>
import { MODULES } from 'src/flox/enum/MODULES';
import COUNTRY_CODES from 'src/flox/enum/COUNTRY_CODES';

import { FIELDS } from '../../../form/data/FIELDS';
import FloxWrapper from '../../../../core/components/FloxWrapper.vue';
import * as auth from '../..';
import SignupFormPages from '../../../form/data/formPages/SignupFormPages';
import GenericForm from '../../../form/components/GenericForm.vue';
import { fetchByKey } from '../../../form/helpers/form-helpers';
import { useFormStore } from '../../../form/stores/form';
import { signupFormKey } from '../../../form/data/FORM_KEYS';

const emit = defineEmits<{
  (
    e: 'submit',
    value: {
      username: string;
      email: string;
      value: string;
      lang?: string;
    }
  ): void;
}>();

const store = useFormStore();

/**
 * Emit the
 * @returns void
 */
function onSubmit(): void {
  const email = fetchByKey({
    ...signupFormKey,
    fieldKey: FIELDS.EMAIL.key,
  }) as string;

  const password = fetchByKey({
    ...signupFormKey,
    fieldKey: FIELDS.PASSWORD_REPEAT.key,
  }) as string;

  const lang =
    (
      fetchByKey({
        ...signupFormKey,
        fieldKey: FIELDS.SELECT_LANGUAGE.key,
      }) as COUNTRY_CODES
    ).toLowerCase() ?? undefined;

  if (auth.moduleConfig().emailAsUsername) {
    emit('submit', { username: email, email, password, lang });
  } else {
    const username = fetchByKey({
      ...signupFormKey,
      fieldKey: FIELDS.USERNAME.key,
    }) as string;

    emit('submit', { username, email, password, lang });
  }
  // Empty store state
  store.clearForm(signupFormKey.formKey);
}
</script>
