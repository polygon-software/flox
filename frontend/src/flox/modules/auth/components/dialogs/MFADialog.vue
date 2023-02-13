<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-md text-center">
      <h5>{{ $t('messages.verification') }}</h5>
      <p class="q-mb-lg text-grey-8">
        {{ $t('messages.enter_2fa') }}
      </p>
      <GenericForm
        style="min-width: 300px"
        :pages="MFAFormPages"
        :form-key="MFAFormKey.formKey"
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

import { MFAFormKey } from '../../../form/data/FORM_KEYS';
import GenericForm from '../../../form/components/GenericForm.vue';
import MFAFormPages from '../../../form/data/formPages/MFAFormPages';
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
  const code = fetchByKey({
    ...MFAFormKey,
    fieldKey: FIELDS.MFA.key,
  }) as string;

  // Empty store state
  store.clearForm(MFAFormKey.formKey);

  onDialogOK(code);
}
</script>
