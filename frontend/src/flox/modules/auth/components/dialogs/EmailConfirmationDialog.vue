<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-pa-md" style="width: 400px; min-height: 250px">
      <q-form class="q-gutter-md" @submit="onSubmit">
        <h5 class="q-ma-none q-mt-lg text-center">
          {{ $t('messages.verification') }}
        </h5>
        <p>{{ $t('messages.enter_verification_code') }}</p>
        <q-input
          v-model="verificationCode"
          :label="$t('authentication.verification_code')"
          maxlength="6"
        />

        <!-- Code resend button -->
        <div class="full-width row justify-center">
          <q-btn
            color="grey-5"
            :label="$t('authentication.resend_code')"
            flat
            no-caps
            :disable="codeSent"
            @click="resendCode"
          />
        </div>

        <!-- Actions (cancel and confirm) -->
        <q-card-actions align="center">
          <q-btn
            :label="$t('general.cancel')"
            flat
            color="primary"
            @click="onDialogHide"
          />
          <q-btn
            color="primary"
            :label="$t('general.confirm')"
            type="submit"
            :disable="verificationCode.length !== 6"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QVueGlobals, useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';

import { i18n } from 'boot/i18n';
import AuthenticationService from 'src/flox/modules/auth/services/auth.service';
import { showSuccessNotification } from 'src/tools/notification.tool';

const props = defineProps<{
  q: QVueGlobals;
  authService: AuthenticationService;
}>();

// eslint-disable-next-line vue/define-emits-declaration
defineEmits(useDialogPluginComponent.emits);

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const verificationCode = ref('');
const codeSent = ref(false);

/**
 * On submit, emit data outwards
 */
function onSubmit(): void {
  onDialogOK({ code: verificationCode.value });
}

/**
 * Resends the e-mail confirmation code
 */
async function resendCode(): Promise<void> {
  if (!codeSent.value) {
    codeSent.value = true;

    // Re-send code
    await props.authService?.resendEmailVerificationCode();

    // Show success message
    showSuccessNotification(props.q, i18n.global.t('messages.code_resent'));
  }
}
</script>
