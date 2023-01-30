<template>
  <FloxWrapper :module="MODULES.AUTH">
    <div class="flex justify-center" style="gap: 20px">
      <h5 class="q-ma-none" style="margin-bottom: 20px">
        {{ $t('authentication.login') }}
      </h5>
      <q-form class="flex flex-center q-gutter-none" @submit="onSubmit">
        <component
          :is="field.component"
          v-for="field in fields"
          :key="field.key"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          class="full-width"
          @change="form.updateValue(field.key, $event)"
        >
          <template #prepend>
            <q-icon
              v-if="field.prependIcon"
              :name="field.prependIcon"
              size="xs"
              color="grey"
            />
          </template>
          <template #append>
            <q-icon
              v-if="field.appendIcon"
              :name="field.appendIcon"
              size="xs"
              color="grey"
            />
          </template>
        </component>
        <div class="q-mt-md">
          <q-btn
            color="primary"
            class="full-width"
            rounded
            :label="$t('authentication.login')"
            type="submit"
          />

          <q-btn
            :label="$t('authentication.forgot_password')"
            class="text-primary full-width q-mt-sm"
            rounded
            flat
            @click="forgotPassword"
          />
        </div>
      </q-form>
    </div>
  </FloxWrapper>
</template>

<script setup lang="ts">
import { defineEmits, inject } from 'vue';
import { MultiPageForm } from 'src/flox/modules/form/components/MultiPageForm';

import FloxWrapper from 'src/flox/core/components/FloxWrapper.vue';
import { MODULES } from 'src/flox/MODULES';
import * as auth from 'src/flox/modules/auth';
import { FIELDS } from 'src/flox/modules/auth/components/forms/fields';
import AuthenticationService from 'src/flox/modules/auth/services/auth.service';

type PasswordInput = {
  identifier: string;
  password: string;
};

const emit = defineEmits<{
  (e: 'submit', form: PasswordInput): void;
}>();

const $authService: AuthenticationService | undefined = inject('$authService');

const fields = [
  auth.moduleConfig().emailAsUsername ? FIELDS.EMAIL : FIELDS.USERNAME,
  FIELDS.PASSWORD,
];

const form = new MultiPageForm();
form.pages.value = [
  {
    key: 'login',
    label: 'Login',
    fields,
  },
];

/**
 * Emits the 'submit' event, containing the form's data
 */
function onSubmit(): void {
  const formValues: PasswordInput = {
    identifier: form.values.value[
      auth.moduleConfig().emailAsUsername
        ? FIELDS.EMAIL.key
        : FIELDS.USERNAME.key
    ] as string,
    password: form.values.value[FIELDS.PASSWORD.key] as string,
  };

  emit('submit', formValues);
}

/**
 * Triggers a password change for a non-logged in authentication
 */
function forgotPassword(): void {
  $authService?.showResetPasswordDialog();
}
</script>

<style scoped>
h5 {
  margin-bottom: 10px;
}
</style>
