<template>
  <div
    class="column q-pa-sm"
    style="width: 250px; text-align: center;"
  >
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
          style="margin-top: 20px;"
          color="primary"
          :label="$t('authentication.login')"
          type="submit"
          :disable="!form.pageValid.value"
      />
      <q-btn
        no-caps
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
import {AuthenticationService} from 'src/services/AuthService';
import {inject, defineEmits} from 'vue';

const $authService: AuthenticationService|undefined = inject('$authService')

const emit = defineEmits(['submit'])

const fields = [FIELDS.USERNAME, FIELDS.PASSWORD, FIELDS.ROUTE_TARGET]

const form = new Form()
form.pages.value = [
  {
    key: 'login',
    label: 'Login',
    fields: fields
  }
]

/**
 * Triggers a password change for a non-logged in user
 * @returns {void}
 */
function forgotPassword() {
  $authService?.showResetPasswordDialog();
}

/**
 * Emits the 'submit' event, containing the form's data
 * @returns {void}
 */
function onSubmit(): void {
  emit('submit', form.values.value)
}
</script>
