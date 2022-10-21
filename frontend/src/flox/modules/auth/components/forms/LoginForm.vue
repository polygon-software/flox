<template>
  <FloxWrapper :module="MODULES.AUTH">
    <div class="column q-pa-sm text-center">
    <h5 class="q-ma-none" style="margin-bottom: 20px;">
      {{ $t('authentication.login') }}
    </h5>
    <q-form
        class="q-gutter-md"
        @submit="onSubmit"
    >
      <component
          :is="field.component"
          v-for="field in fields"
          :key="field.key"
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
import {FIELDS} from 'src/flox/modules/auth/components/forms/fields';
import { MultiPageForm } from 'components/forms/MultiPageForm'
import {defineEmits, inject} from 'vue';
import {AuthenticationService} from 'src/flox/modules/auth/services/auth.service';
import FloxWrapper from 'src/flox/core/components/FloxWrapper.vue';
import {MODULES} from 'src/flox/MODULES';
import * as auth from 'src/flox/modules/auth'

const $authService: AuthenticationService|undefined = inject('$authService')

const emit = defineEmits(['submit'])

const fields = [
  auth.moduleConfig().emailAsUsername ? FIELDS.EMAIL : FIELDS.USERNAME,
  FIELDS.PASSWORD
]

const form = new MultiPageForm()
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
