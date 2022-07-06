<template>
  <q-dialog
    ref="dialog"
  >
    <q-card class="q-pa-md" style="width: 400px; min-height: 250px">
      <q-form
        @submit="onSubmit"
        class="q-gutter-md"
      >
        <h5 class="q-ma-none q-mt-lg text-center">{{ $t('messages.verification') }}</h5>
        <p> {{ $t('messages.enter_verification_code')}} </p>
        <q-input
          :label="$t('authentication.verification_code')"
          maxlength="6"
          v-model="verificationCode"
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
            @click="hide"
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
import {defineEmits, defineProps, PropType, Ref, ref} from 'vue';
import {QDialog, QVueGlobals} from 'quasar';
import {AuthenticationService} from 'src/flox/modules/auth/services/AuthService';
import {showNotification} from 'src/helpers/tools/notification-helpers';
import {i18n} from 'boot/i18n';

const props = defineProps({
  q : {
    type: Object as PropType<QVueGlobals>,
    required: true,
  },
  authService: {
    type: Object as PropType<AuthenticationService>,
    required: true
  }
})

const verificationCode = ref('')
const codeSent = ref(false)

const emit = defineEmits(['ok'])
let dialog: Ref<QDialog|null> = ref(null)

/**
 * On submit, emit data outwards
 * @returns {void}
 */
function onSubmit(){
  emit('ok', {
    code: verificationCode.value,
  })
  hide()
}

// Mandatory - do not remove!
// eslint-disable-next-line @typescript-eslint/no-unused-vars,require-jsdoc
function show(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
 dialog.value?.show()
}

// eslint-disable-next-line require-jsdoc
function hide(): void{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dialog.value?.hide()
}

/**
 * Resends the e-mail confirmation code
 * @returns {Promise<void>} - done
 */
async function resendCode(){
  if(!codeSent.value){
    codeSent.value = true;

    // Re-send code
    await props.authService?.resendEmailVerificationCode()

    // Show success message
    showNotification(
      props.q,
      i18n.global.t('messages.code_resent'),
      'bottom',
      'positive'
    )
  }
}

</script>
