<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-md text-center">
      <h6>{{ $t('authentication.forgot_password') }}</h6>
      <div class="q-mb-lg text-subtitle2">
        {{ $t('authentication.forgot_password_hint') }}
      </div>
      <GenericForm
        style="min-width: 300px"
        :pages="ForgotPasswordFormPages"
        :form-key="forgotPasswordFormKey.formKey"
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

import { forgotPasswordFormKey } from '../../../form/data/form/FormKeys';
import GenericForm from '../../../form/components/GenericForm.vue';
import ForgotPasswordFormPages from '../../../form/data/form/ForgotPasswordFormPages';
import { fetchByKey } from '../../../form/helpers/form-helpers';
import { FIELDS } from '../../../form/data/form/FIELDS';
import { useFormStore } from '../../../form/stores/form';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const store = useFormStore();

/**
 * Upon submit, pass entered values outwards
 * @returns void
 */
function onSubmit(): void {
  const email = fetchByKey({
    ...forgotPasswordFormKey,
    fieldKey: FIELDS.EMAIL.key,
  }) as string;

  // Empty store state
  store.clearForm(forgotPasswordFormKey.formKey);

  onDialogOK(email);
}
</script>
