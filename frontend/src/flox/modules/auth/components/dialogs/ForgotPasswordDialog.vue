<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card>
      <q-card-section class="text-center">
        <h6>{{ $t('authentication.reset_password') }}</h6>
        <GenericForm
          style="min-width: 300px"
          :pages="ForgotPasswordFormPages"
          :form-key="forgotPasswordFormKey.formKey"
          text-position="center"
          show-cancel
          @submit="onSubmit"
          @cancel="onDialogCancel"
        />
      </q-card-section>
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
