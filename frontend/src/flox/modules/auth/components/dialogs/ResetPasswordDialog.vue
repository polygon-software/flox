<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-lg q-pt-xl" style="width: 400px; min-height: 250px">
      <q-form
        class="q-gutter-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit="onSubmit"
      >
        <strong>{{ $t('authentication.forgot_password') }}</strong>
        <q-input
          v-model="verificationCode"
          :label="$t('authentication.verification_code')"
        />
        <q-input
          v-model="password"
          :label="$t('authentication.new_password')"
          type="password"
          :rules="passwordRules"
        />
        <q-input
          v-model="passwordRep"
          :label="$t('authentication.new_password_repeat')"
          type="password"
          :rules="matchingRules"
        />
        <q-card-actions align="right">
          <q-btn
            color="primary"
            :label="$t('general.confirm')"
            :disable="password !== passwordRep || verificationCode.length !== 6"
            type="submit"
          />
          <q-btn
            :label="$t('general.cancel')"
            color="primary"
            @click="onDialogHide"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';

import { i18n } from 'boot/i18n';
import {
  joiPasswordSchema,
  joiSchemaToValidationRule,
} from 'src/tools/validation.tool';

// eslint-disable-next-line vue/define-emits-declaration
defineEmits(useDialogPluginComponent.emits);

const verificationCode = ref('');
const password = ref('');
const passwordRep = ref('');

const passwordRules = [
  joiSchemaToValidationRule(
    joiPasswordSchema(),
    i18n.global.t('errors.invalid_password')
  ),
];
const matchingRules = [
  (val: string): true | string =>
    val === password.value || i18n.global.t('errors.non_matching_password'),
];

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

/**
 * On submit, emit data outwards
 */
function onSubmit(): void {
  onDialogOK({
    passwordNew: password.value,
    verificationCode: verificationCode.value,
  });
}
</script>
