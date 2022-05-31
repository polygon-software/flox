<template>
  <FloxWrapper :module="MODULES.AUTH">
    <div class="column q-pa-sm text-center">
    <h5 class="q-ma-none" style="margin-bottom: 20px;">
      {{ $t('authentication.login') }}
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
      />

      <q-btn
        :label="$t('authentication.forgot_password')"
        class="text-primary"
        flat
        @click="forgotPassword"
      />
    </q-form>
  </div>
  </FloxWrapper>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import {defineEmits, inject} from 'vue';
import {AuthenticationService} from 'src/flox/modules/auth/services/AuthService';
import FloxWrapper from 'src/flox/core/components/FloxWrapper.vue';
import {MODULES} from 'src/flox/MODULES';
import * as auth from 'src/flox/modules/auth'

const $authService: AuthenticationService|undefined = inject('$authService')

const emit = defineEmits(['submit'])

const fields = [
  auth.moduleConfig().emailAsUsername ? FIELDS.EMAIL : FIELDS.USERNAME,
  FIELDS.PASSWORD
]

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
  const formValues: Record<string, unknown> = {
    identifier: form.values.value[auth.moduleConfig().emailAsUsername ? FIELDS.EMAIL.key : FIELDS.USERNAME.key],
    password: form.values.value[FIELDS.PASSWORD.key],
  }

  emit('submit', formValues)
}

/**
 * Triggers a password change for a non-logged in authentication
 * @returns {void}
 */
function forgotPassword() {
  $authService?.showResetPasswordDialog();
}
</script>
