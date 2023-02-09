<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-md text-center">
      <h6>{{ $t('authentication.reset_password') }}</h6>
      <GenericForm
        style="min-width: 300px"
        :pages="ResetPasswordFormPages"
        :form-key="resetPasswordFormKey.formKey"
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

import { useFormStore } from 'src/flox/modules/form/stores/form';

import GenericForm from '../../../form/components/GenericForm.vue';
import { resetPasswordFormKey } from '../../../form/data/form/FormKeys';
import ResetPasswordFormPages from '../../../form/data/form/ResetPasswordFormPages';
import { fetchByKey } from '../../../form/helpers/form-helpers';
import { FIELDS } from '../../../form/data/form/FIELDS';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const store = useFormStore();

/**
 * On submit, emit data outwards
 */
function onSubmit(): void {
  const verificationCode = fetchByKey({
    ...resetPasswordFormKey,
    fieldKey: FIELDS.VERIFICATION_CODE.key,
  });

  const newPassword = fetchByKey({
    ...resetPasswordFormKey,
    fieldKey: FIELDS.PASSWORD_REPEAT.key,
  });

  // Empty store state
  store.clearForm(resetPasswordFormKey.formKey);

  onDialogOK({
    verificationCode,
    newPassword,
  });
}
</script>
