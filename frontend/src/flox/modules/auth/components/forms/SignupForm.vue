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
          @change="(newValue) => form.updateValue(field.key, newValue)"
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
import { MultiPageForm } from 'components/forms/MultiPageForm';
import FloxWrapper from 'src/flox/core/components/FloxWrapper.vue';
import { MODULES } from 'src/flox/MODULES';
import * as auth from 'src/flox/modules/auth';
import { FIELDS } from 'src/flox/modules/auth/components/forms/fields';
import { defineEmits } from 'vue';

const emit = defineEmits(['submit', 'cancel']);

const fields = auth.moduleConfig().emailAsUsername
  ? [FIELDS.EMAIL, FIELDS.PASSWORD_REPEAT]
  : [FIELDS.USERNAME, FIELDS.EMAIL, FIELDS.PASSWORD_REPEAT];

const form = new MultiPageForm();
form.pages.value = [
  {
    key: 'login',
    label: 'Login',
    fields: fields,
  },
];

/**
 * Emits the 'submit' event, containing the form's data
 */
function onSubmit(): void {
  const formValues: Record<string, unknown> = {
    email: form.values.value[FIELDS.EMAIL.key],
    password: form.values.value[FIELDS.PASSWORD_REPEAT.key],
  };

  // If e-mail is also username, add 'username' field directly (identical to e-mail)
  if (auth.moduleConfig().emailAsUsername) {
    formValues.username = form.values.value[FIELDS.EMAIL.key];
  } else {
    formValues.username = form.values.value[FIELDS.USERNAME.key];
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
