<template>
  <!-- Show generated password -->
  <q-input
    v-if="fieldValue"
    v-model="fieldValue"
    :type="showPassword ? 'text' : 'password'"
    readonly
  >
    <template #prepend>
      <q-icon
        :name="showPassword ? 'visibility_off' : 'visibility'"
        style="cursor: pointer"
        @click="showPassword = !showPassword"
      />
    </template>
    <template #append>
      <q-icon name="content_copy" style="cursor: pointer" @click="copy" />
    </template>
  </q-input>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

import { i18n } from 'boot/i18n';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'src/tools/notification.tool';

const props = withDefaults(
  defineProps<{
    password: string;
  }>(),
  {}
);

const $q = useQuasar();

const fieldValue = ref(props.password);

const showPassword = ref(false);

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
