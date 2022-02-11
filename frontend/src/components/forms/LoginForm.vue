<template>
  <div
    class="column q-pa-sm"
    style="width: 600px; text-align: center;"
  >
    <h5 class="q-ma-none" style="margin-bottom: 20px;">
      {{ $t('authentication.main_text') }}
    </h5>
    <p class="q-ma-none" style="margin-bottom: 20px;">
      {{ $t('authentication.sign_in') }}
    </p>
    <q-form
      class="q-gutter-md"
      style="width: 300px; align-self: center"
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
        no-caps
        :label="$t('authentication.forgot_password')"
        class="text-primary"
        flat
        @click="forgotPassword"
      />
      <br>
      <q-btn
          style="margin-top: 20px;"
          color="primary"
          :label="$t('authentication.login')"
          type="submit"
          :disable="!form.pageValid.value"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import {inject, defineEmits} from 'vue';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';

const $routerService: RouterService|undefined = inject('$routerService')

const emit = defineEmits(['submit'])

const fields = [FIELDS.EMAIL, FIELDS.PASSWORD]

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
async function forgotPassword() {
  await $routerService?.routeTo(ROUTES.RESET_PASSWORD)
}

/**
 * Emits the 'submit' event, containing the form's data
 * @returns {void}
 */
function onSubmit(): void {
  emit('submit', form.values.value)
}
</script>
