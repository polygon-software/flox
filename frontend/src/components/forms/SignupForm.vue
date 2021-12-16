<template>
  <div class="q-pa-sm">
    <h5 class="q-mb-none" style="margin-bottom: 30px;">
      {{ $t('authentication.signup') }}
    </h5>
    <q-form
        class="q-gutter-md"
        @submit="onSubmit"
        >
    <q-stepper
        ref="stepper"
        v-model="form.step.value"
        active-color="primary"
        done-icon="done"
        animated
        transition-next="fade"
        transition-prev="fade"
    >
      <q-step
          v-for="(page, index) in form.pages.value"
          :key="page.key"
          :name="index+1"
          :prefix="index+1"
          :title="page.label"
          :done="form.step.value > index"
          class="flex flex-center"
      >
        <component
              :is="field.component"
              v-for="field in page.fields"
              :key="field.key"
              v-bind="field.attributes"
              v-model="form.values.value[field.key]"
              @change="(newValue) => form.updateValue(field.key, newValue)"
          />
      </q-step>
      <template #navigation>
        <q-stepper-navigation>
          <q-btn
              v-if="form.step.value > 1"
              flat
              style="margin-right: 30px"
              color="primary"
              :label="$t('buttons.back')"
              class="q-ml-sm"
              @click="$refs.stepper.previous()" />
          <q-btn
              v-if="form.step.value < form.pages.value.length"
              color="primary"
              :label="$t('buttons.next_step')"
              :disable="!form.pageValid.value"
              @click="$refs.stepper.next()"
          />
          <q-btn
              v-if="form.step.value === form.pages.value.length"
              color="primary"
              :label="$t('buttons.finish_signup')"
              type="submit"
              :disable="!form.pageValid.value"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { FIELDS } from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import { i18n } from 'boot/i18n';
import {defineEmits} from 'vue';

/**
 * This component enables a multi-step sign up form using Quasar's q-stepper. In "form.pages.value" the different
 * steps are defined.The fields a page contains are defined in the fields variable.
 * Common fields can be found under "src/data/FIELDS".
 * All fields of a page must be completed before the next page can be accessed.
 */

const emit = defineEmits(['submit'])

const account_fields = [FIELDS.EMAIL, FIELDS.USERNAME, FIELDS.PASSWORD_REPEAT]
const personal_fields = [FIELDS.FULL_NAME, FIELDS.BIRTHDATE, FIELDS.PHONE_NUMBER]
const address_fields  = [FIELDS.LIVING_ADDRESS]
const interest_fields = [FIELDS.INTERESTS]

const form = new Form()

form.pages.value = [
  {
    key: 'account_data',
    label: i18n.global.t('account_data.account'),
    fields: account_fields,
  },
  {
    key: 'personal_data',
    label: i18n.global.t('account_data.personal'),
    fields: personal_fields,
  },
  {
    key: 'address_data',
    label: i18n.global.t('account_data.address'),
    fields: address_fields,
  },
  {
    key: 'interests',
    label: i18n.global.t('account_data.interests'),
    fields: interest_fields,
  },
]

/**
 * Emits the 'submit' event, containing the form's data
 * @returns {void}
 */
function onSubmit(): void {
  console.log('SUBMIT values', form.values.value)
  emit('submit', form.values.value)
}

</script>
