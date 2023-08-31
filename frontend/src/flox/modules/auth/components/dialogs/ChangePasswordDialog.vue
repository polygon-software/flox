<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-md text-center">
      <h5>{{ $t('authentication.set_new_password') }}</h5>
      <GenericForm
        style="min-width: 300px"
        :pages="ChangePasswordFormPages"
        :form-key="changePasswordFormKey.formKey"
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

import { changePasswordFormKey } from '../../../form/data/FORM_KEYS';
import GenericForm from '../../../form/components/GenericForm.vue';
import ChangePasswordFormPages from '../../../form/data/formPages/ChangePasswordFormPages';
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
  const newPassword = fetchByKey({
    ...changePasswordFormKey,
    fieldKey: FIELDS.PASSWORD_REPEAT.key,
  });

  // Empty store state
  store.clearForm(changePasswordFormKey.formKey);

  onDialogOK({
    passwordNew: newPassword,
  });
}
</script>
