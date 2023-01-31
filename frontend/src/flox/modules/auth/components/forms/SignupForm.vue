<template>
  <FloxWrapper :module="MODULES.AUTH">
    <div class="column q-pa-sm text-center">
      <h5 class="q-ma-none" style="margin-bottom: 20px">
        {{ $t('authentication.signup') }}
      </h5>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <component
          :is="field.component"
          v-for="field in fields"
          :key="field.key"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          @change="form.updateValue(field.key, $event)"
        />
        <q-btn
          style="margin-top: 20px"
          color="primary"
          :label="$t('authentication.signup')"
          type="submit"
          :disable="!form.pageValid.value"
        />

        <q-btn
          :label="$t('general.cancel')"
          class="text-primary"
          flat
          @click="onCancel"
        />
      </q-form>
    </div>
  </FloxWrapper>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

import MultiPageForm from '../../../form/components/MultiPageForm.vue';
import FloxWrapper from '../../../../core/components/FloxWrapper.vue';
import { MODULES } from '../../../../MODULES';
import * as auth from '../..';

import { FIELDS } from './fields';

type SignUp = {
  username: string;
  email: string;
  password: string;
};

const emit = defineEmits<{
  (e: 'submit', formValues: SignUp): void;
  (e: 'cancel'): void;
}>();

const fields = auth.moduleConfig().emailAsUsername
  ? [FIELDS.EMAIL, FIELDS.PASSWORD_REPEAT]
  : [FIELDS.USERNAME, FIELDS.EMAIL, FIELDS.PASSWORD_REPEAT];

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
  const formValues: SignUp = {
    username: '',
    email: form.values.value[FIELDS.EMAIL.key] as string,
    password: form.values.value[FIELDS.PASSWORD_REPEAT.key] as string,
  };

  // If e-mail is also username, add 'username' field directly (identical to e-mail)
  if (auth.moduleConfig().emailAsUsername) {
    formValues.username = form.values.value[FIELDS.EMAIL.key] as string;
  } else {
    formValues.username = form.values.value[FIELDS.USERNAME.key] as string;
  }

  emit('submit', formValues);
}

/**
 * On cancel, emit 'cancel' event
 */
function onCancel(): void {
  emit('cancel');
}
</script>
