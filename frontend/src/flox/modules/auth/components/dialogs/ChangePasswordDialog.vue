<template>
  <q-dialog ref="dialogRef" persistent>
    <GenericForm
      :pages="ChangePasswordFormPages"
      :form-key="changePasswordFormKey.formKey"
      @submit="onSubmit"
    />
    <q-btn
      :class="`${ALTERNATE_BUTTON_CLASS} q-my-md`"
      :style="`${DEFAULT_BUTTON_STYLE}; width: 150px;`"
      :label="$t('buttons.cancel')"
      @click="onDialogHide"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';

import {
  ALTERNATE_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from 'src/css/defaultStyles';
import { changePasswordFormKey } from 'src/flox/modules/form/data/form/FormKeys';

import GenericForm from '../../../form/components/GenericForm.vue';
import ChangePasswordFormPages from '../../../form/data/form/ChangePasswordFormPages';
import { fetchByKey } from '../../../form/helpers/form-helpers';
import { FIELDS } from '../../../form/data/form/FIELDS';
import { useFormStore } from '../../../form/stores/form';

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const store = useFormStore();

/**
 * Upon submit, pass entered values outwards
 * @returns void
 */
function onSubmit(): void {
  const newPassword = fetchByKey({
    ...changePasswordFormKey,
    fieldKey: FIELDS.PASSWORD_REAPEAT.key,
  });

  // Empty store state
  store.clearForm(changePasswordFormKey.formKey);

  onDialogOK({
    passwordNew: newPassword,
  });
}
</script>
