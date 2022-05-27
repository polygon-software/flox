<template>
  <div class="column q-pa-sm text-center">
    <h5 class="q-ma-none" style="margin-bottom: 20px;">
      {{ $t('login') }}
    </h5>
    <q-form
        @submit="onSubmit"
        class="q-gutter-md"
    >
      <component
          v-for="field in fields"
          :key="field.key"
          :is="field.component"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          @change="(newValue) => form.updateValue(field.key, newValue)"
      />
      <q-btn
          style="margin-top: 20px"
          color="primary"
          :label="$t('authentication.login')"
          type="submit"
          :disable="!form.pageValid.value"
      />

      <q-btn
        :label="$t('authentication.forgot_password')"
        class="text-primary"
        flat
        @click="forgotPassword"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import {defineEmits, inject} from 'vue';
import {AuthenticationService} from 'src/services/AuthService';
const $authService: AuthenticationService|undefined = inject('$authService')

const emit = defineEmits(['submit'])

const fields = [FIELDS.USERNAME, FIELDS.PASSWORD]

const form = new Form()
form.pages.value = [
  {
    key: 'login',
    label: 'Login',
    fields: fields
  }
]

/**
 * Emits the 'submit' event, containing the form's data
 * @returns {void}
 */
function onSubmit(): void {
  emit('submit', form.values.value)
}

/**
 * Triggers a password change for a non-logged in authentication
 * @returns {void}
 */
function forgotPassword() {
  $authService?.showResetPasswordDialog();
}
</script>
