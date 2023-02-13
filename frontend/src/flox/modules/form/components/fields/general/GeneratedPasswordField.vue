<template>
  <!-- Show generated password -->
  <q-input
    v-if="fieldValue"
    v-model="fieldValue"
    :label="$t('authentication.created_users_password')"
    :hint="$t('authentication.created_users_password_hint')"
    type="password"
    readonly
  >
    <template #prepend>
      <q-icon name="content_copy" @click="copy" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { useQuasar } from 'quasar';

import { i18n } from 'boot/i18n';

import { FormStateKey } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../../helpers/notification-helpers';

const props = withDefaults(
  defineProps<{
    // The generated password for the user, only if no invitation has been sent
    password?: string | null;
    // Used to fetch data from the store
    stateKey: FormStateKey;
  }>(),
  {
    password: null,
  }
);

const $q = useQuasar();

const fieldValue = computed(() => {
  return fetchByKey({ ...props.stateKey, fieldKey: 'generatedPassword' }) as
    | string
    | null;
});

/**
 * Copies the generated password to the clipboard.
 * @returns void
 */
function copy(): void {
  if (fieldValue.value) {
    navigator.clipboard.writeText(fieldValue.value).then(
      () => {
        showSuccessNotification(
          $q,
          i18n.global.t('messages.copied_to_clipboard')
        );
      },
      () => {
        showErrorNotification($q, i18n.global.t('errors.copy_failed'));
      }
    );
  }
}
</script>
