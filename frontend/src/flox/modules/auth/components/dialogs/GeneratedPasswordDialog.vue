<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-md text-center">
      <h5>{{ $t('authentication.created_users_password') }}</h5>
      <p class="q-mb-lg text-grey-8">
        {{ $t('authentication.created_users_password_hint') }}
      </p>
      <GeneratedPasswordField :value="generatedPwd" />
      <q-btn
        :class="`${ALTERNATE_BUTTON_CLASS} q-mt-xl`"
        :label="$t('buttons.ok')"
        :style="`${DEFAULT_BUTTON_STYLE}`"
        color="primary"
        @click="onDialogOK"
      />
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';

import {
  ALTERNATE_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from 'src/css/defaultStyles';

import GeneratedPasswordField from '../../../form/components/fields/general/GeneratedPasswordField.vue';

const props = withDefaults(
  defineProps<{
    value: string;
  }>(),
  {}
);

const { dialogRef, onDialogOK } = useDialogPluginComponent();
</script>
