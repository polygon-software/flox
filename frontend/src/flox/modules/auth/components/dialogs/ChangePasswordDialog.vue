<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-pa-sm" style="width: 400px; min-height: 250px">
      <strong>{{ $t('authentication.change_password') }}</strong>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <q-input
          v-model="passwordOld"
          :label="$t('authentication.old_password')"
          type="password"
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
            :disable="password !== passwordRep"
            @click="onSubmit"
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars,vue/define-emits-declaration
const emit = defineEmits(useDialogPluginComponent.emits);

const passwordOld = ref('');
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
 * Upon submit, pass entered values outwards
 */
function onSubmit(): void {
  onDialogOK({
    passwordNew: password.value,
    passwordOld: passwordOld.value,
  });
}
</script>
