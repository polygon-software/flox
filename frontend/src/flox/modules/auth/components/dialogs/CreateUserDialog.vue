<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-md text-center">
      <h5>{{ $t('authentication.create_user') }}</h5>
      <GenericForm
        style="min-width: 300px"
        :pages="CreateUserPages"
        :form-key="createUserFormKey.formKey"
        text-position="center"
        show-cancel
        @submit="onSubmit"
        @cancel="onDialogCancel"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

import COUNTRY_CODES from 'src/flox/COUNTRIES';

import { createUserFormKey } from '../../../form/data/form/FormKeys';
import GenericForm from '../../../form/components/GenericForm.vue';
import CreateUserPages from '../../../form/data/form/CreateUserPages';
import { fetchByKey } from '../../../form/helpers/form-helpers';
import { FIELDS } from '../../../form/data/form/FIELDS';
import { useFormStore } from '../../../form/stores/form';
import CognitoOptions from '../../../form/data/types/CognitoOptions';
import * as auth from '../..';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const store = useFormStore();

/**
 * Upon submit, pass entered values outwards
 * @returns void
 */
function onSubmit(): void {
  let username;

  const email = fetchByKey({
    ...createUserFormKey,
    fieldKey: FIELDS.EMAIL.key,
  }) as string;

  const cognitoOptions = fetchByKey({
    ...createUserFormKey,
    fieldKey: FIELDS.COGNITO_OPTIONS.key,
  }) as CognitoOptions;

  const language = (
    fetchByKey({
      ...createUserFormKey,
      fieldKey: FIELDS.SELECT_LANGUAGE.key,
    }) as COUNTRY_CODES
  ).toLowerCase();

  if (auth.moduleConfig().emailAsUsername) {
    username = fetchByKey({
      ...createUserFormKey,
      fieldKey: FIELDS.USERNAME.key,
    }) as string;
  }

  // Empty store state
  store.clearForm(createUserFormKey.formKey);

  onDialogOK({
    email,
    cognitoOptions,
    language,
    username: username ?? email,
  });
}
</script>
