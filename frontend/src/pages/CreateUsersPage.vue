<template>
  <q-card class="q-pa-md" style="width: 500px">
    <h4>{{ $t('authentication.create_user') }}</h4>
    <GenericForm
      :pages="CreateUserPages"
      :form-key="createUserFormKey.formKey"
      text-position="center"
      @submit="onSubmit"
    />
  </q-card>
</template>

<script setup lang="ts">
import { inject } from 'vue';

import DELIVERY_MEDIUMS from 'src/flox/enum/DELIVERY_MEDIUMS';

import COUNTRY_CODES from '../flox/enum/COUNTRIES';
import ROLE from '../flox/enum/USER_ROLES';
import { createUserFormKey } from '../flox/modules/form/data/FORM_KEYS';
import GenericForm from '../flox/modules/form/components/GenericForm.vue';
import CreateUserPages from '../flox/modules/form/data/formPages/CreateUserPages';
import { fetchByKey } from '../flox/modules/form/helpers/form-helpers';
import { FIELDS } from '../flox/modules/form/data/FIELDS';
import { useFormStore } from '../flox/modules/form/stores/form';
import * as auth from '../flox/modules/auth';
import AuthenticationService from '../flox/modules/auth/services/auth.service';

const $authService: AuthenticationService | undefined = inject('$authService');
const store = useFormStore();

/**
 * Upon submit, pass entered values outwards
 * @returns void
 */
async function onSubmit(): Promise<void> {
  let username;

  const email = fetchByKey({
    ...createUserFormKey,
    fieldKey: FIELDS.EMAIL.key,
  }) as string;

  const deliveryMediums = fetchByKey({
    ...createUserFormKey,
    fieldKey: FIELDS.SEND_INVITE.key,
  }) as [DELIVERY_MEDIUMS];

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
    username = fetchByKey({
      ...createUserFormKey,
      fieldKey: FIELDS.USERNAME.key,
    }) as string;
  }

  // Empty store state
  store.clearForm(createUserFormKey.formKey);

  await $authService?.adminCreateUser(
    username ?? email,
    email,
    role,
    deliveryMediums,
    locale
  );
}
</script>
