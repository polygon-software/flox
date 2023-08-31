<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-md text-center">
      <h5>{{ $t('authentication.forgot_password') }}</h5>
      <p class="q-mb-lg text-grey-8">
        {{ $t('authentication.forgot_password_hint') }}
      </p>
      <GenericForm
        :form-key="forgotPasswordFormKey.formKey"
        :pages="ForgotPasswordFormPages"
        show-cancel
        style="min-width: 300px"
        text-position="center"
        @cancel="onDialogCancel"
        @submit="onSubmit"
      />
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';

import { forgotPasswordFormKey } from '../../../form/data/FORM_KEYS';
import GenericForm from '../../../form/components/GenericForm.vue';
import ForgotPasswordFormPages from '../../../form/data/formPages/ForgotPasswordFormPages';
import { fetchByKey } from '../../../form/helpers/form-helpers';
import { FIELDS } from '../../../form/data/FIELDS';
import { useFormStore } from '../../../form/stores/form';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const store = useFormStore();

/**
 * Upon submit, pass entered values outwards
 * @returns void
 */
function onSubmit(): void {
  const username = fetchByKey({
    ...forgotPasswordFormKey,
    fieldKey: FIELDS.USERNAME.key,
  }) as string;

  // Empty store state
  store.clearForm(forgotPasswordFormKey.formKey);

  onDialogOK(username);
}
</script>
