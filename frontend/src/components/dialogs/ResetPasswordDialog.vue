<template>
  <q-dialog
      ref="dialog"
      :persistent="true"
  >
    <q-card class="q-pa-sm" style="width: 400px; min-height: 350px">
      <q-form
          class="q-gutter-md"
          @submit="onSubmit"
      >
        <strong>{{ $t('authentication.reset_password') }}</strong>
        <q-input
            v-model="verificationCode"
            :label="$t('authentication.email_verification_code')"
        />
        <q-input
            v-model="password"
            :label="$t('authentication.new_password')"
            type="password"
            :rules="[passwordRules]"
        />
        <q-input
            v-model="passwordRep"
            :label="$t('authentication.new_password_repeated')"
            type="password"
            :rules="[
              val => val === password || 'Passwords must be identical',
            ]"
        />
        <q-card-actions align="right">
          <q-btn
            :label="$t('buttons.cancel')"
            color="primary"
            @click="hide"
          />
          <q-btn
              color="primary"
              :label="$t('buttons.confirm_change')"
              :disable="password !== passwordRep || verificationCode.length !== 6"
              type="submit"
          />
        </q-card-actions>
      </q-form>

    </q-card>

  </q-dialog>
</template>

<script setup lang="ts">
import {defineEmits, Ref, ref} from 'vue';
import {PASSWORD_MIN_LENGTH, PASSWORD_REGEX} from 'src/helpers/REGEX'
import {QDialog} from 'quasar';
import {i18n} from 'boot/i18n';

const verificationCode = ref('')
const password = ref('')
const passwordRep = ref('')

const emit = defineEmits(['ok'])
const dialog: Ref<QDialog|null> = ref(null)

/**
 * Rules for validation of password
 * @param {string} val - the password
 * @returns {boolean|string} - success (true), or an error message
 */
const passwordRules = (val: string) => {
  if (!PASSWORD_MIN_LENGTH.test(val)) {
    return i18n.global.t('errors.password_too_short')
  } else if (!PASSWORD_REGEX.test(val)){
    // must contain at least one of each: lower-, and an uppercase letter, a digit, and a special character
    return i18n.global.t('errors.password_missing')
  }
  return true
}


/**
 * On submit, emit data outwards
 * @returns {void}
 */
function onSubmit(){
  emit('ok', {
    passwordNew: password.value,
    verificationCode: verificationCode.value,
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

</script>
