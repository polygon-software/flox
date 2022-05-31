<template>
  <FloxWrapper :module="MODULES.AUTH">
    <div class="column q-pa-sm text-center">
      <h5 class="q-ma-none" style="margin-bottom: 20px;">
        {{ $t('authentication.signup') }}
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
import {FIELDS} from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import {defineEmits} from 'vue';
import FloxWrapper from 'src/flox/core/components/FloxWrapper.vue';
import {MODULES} from 'src/flox/MODULES';
import * as auth from 'src/flox/modules/auth'

const emit = defineEmits(['submit', 'cancel'])

const fields = auth.moduleConfig().emailAsUsername ?
[
  FIELDS.EMAIL,
  FIELDS.PASSWORD_REPEAT
] : [
    FIELDS.USERNAME,
    FIELDS.EMAIL,
    FIELDS.PASSWORD_REPEAT
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
    email: form.values.value[FIELDS.EMAIL.key],
    password: form.values.value[FIELDS.PASSWORD_REPEAT.key],
  }

  // If e-mail is also username, add 'username' field directly (identical to e-mail)
  if( auth.moduleConfig().emailAsUsername){
    formValues.username = form.values.value[FIELDS.EMAIL.key]
  } else {
    formValues.username = form.values.value[FIELDS.USERNAME.key]
  }

  emit('submit', formValues)
}

/**
 * On cancel, emit 'cancel' event
 * @returns {Promise<void>} - done
 */
function onCancel() {
  emit('cancel')
}
</script>
