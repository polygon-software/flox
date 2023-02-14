<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-pa-md text-center">
      <h5>{{ $t('authentication.created_users_password') }}</h5>
      <p class="q-mb-lg text-grey-8">
        {{ $t('authentication.created_users_password_hint') }}
      </p>
      <GeneratedPasswordField :password="password" />
      <q-btn
        color="primary"
        :label="$t('buttons.ok')"
        :class="`${ALTERNATE_BUTTON_CLASS} q-mt-xl`"
        :style="`${DEFAULT_BUTTON_STYLE}`"
        @click="onDialogOK"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { defineProps } from 'vue';

import GeneratedPasswordField from '../../../form/components/fields/general/GeneratedPasswordField.vue';
import {
  ALTERNATE_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from '../../../../../css/defaultStyles';

const props = withDefaults(
  defineProps<{
    password: string;
  }>(),
  {}
);

const { dialogRef, onDialogOK } = useDialogPluginComponent();
</script>
