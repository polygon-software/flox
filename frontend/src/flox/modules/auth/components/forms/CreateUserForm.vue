<template>
  <FloxWrapper :module="MODULES.AUTH">
    <div class="column q-pa-sm text-center justify-center">
      <GenericForm
        :finish-label="$t('buttons.create')"
        :form-key="createUserFormKey.formKey"
        :pages="CreateUserPages"
        text-position="center"
        @submit="onSubmit"
      />
    </div>
  </FloxWrapper>
</template>

<script lang="ts" setup>
import CreateUserPages from 'src/flox/modules/form/data/formPages/CreateUserPages';
import SendInvite from 'src/flox/modules/form/data/types/SendInvite';
import ROLE from 'src/flox/enum/USER_ROLES';
import { MODULES } from 'src/flox/enum/MODULES';

import { FIELDS } from '../../../form/data/FIELDS';
import FloxWrapper from '../../../../core/components/FloxWrapper.vue';
import * as auth from '../..';
import GenericForm from '../../../form/components/GenericForm.vue';
import { fetchByKey } from '../../../form/helpers/form-helpers';
import { useFormStore } from '../../../form/stores/form';
import { createUserFormKey } from '../../../form/data/FORM_KEYS';
import COUNTRY_CODES from '../../../../enum/COUNTRY_CODES';

const emit = defineEmits<{
  (
    e: 'submit',
    value: {
      username: string;
      email: string;
      locale: string;
      sendInviteInfo: SendInvite;
      role: ROLE;
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
    ...createUserFormKey,
    fieldKey: FIELDS.EMAIL.key,
  }) as string;

  const sendInviteInfo = fetchByKey({
    ...createUserFormKey,
    fieldKey: FIELDS.SEND_INVITE.key,
  }) as SendInvite;

  const locale = (
    fetchByKey({
      ...createUserFormKey,
      fieldKey: FIELDS.SELECT_LANGUAGE.key,
    }) as COUNTRY_CODES
  ).toLowerCase();

  const role = fetchByKey({
    ...createUserFormKey,
    fieldKey: FIELDS.USER_ROLE.key,
  }) as ROLE;

  if (auth.moduleConfig().emailAsUsername) {
    emit('submit', { username: email, email, locale, sendInviteInfo, role });
  } else {
    const username = fetchByKey({
      ...createUserFormKey,
      fieldKey: FIELDS.USERNAME.key,
    }) as string;

    emit('submit', { username, email, locale, sendInviteInfo, role });
  }
  // Empty store state
  store.clearForm(createUserFormKey.formKey);
}
</script>
