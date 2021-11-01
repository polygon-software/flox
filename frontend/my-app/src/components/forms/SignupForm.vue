<template>
  <div class="q-pa-sm">
    <h5 class="q-ma-none" style="margin-bottom: 30px;">
      {{ $t('signup') }}
    </h5>
    <q-form
        @submit="form.onSubmit"
        class="q-gutter-md"
        >
    <q-stepper
        v-model="form.step.value"
        ref="stepper"
        animated
        active-color="primary"
        transition-duration="1000"
        done-icon="done"
    >
      <q-step
          v-for="(page, index) in form.pages.value"
          :key="page.key"
          :name="index+1"
          :prefix="index+1"
          :title="page.label"
          :done="form.step.value > index"
      >
        <component
              v-for="field in page.fields"
              :key="field.key"
              :is="field.component"
              v-bind="field.attributes"
              v-model="form.values.value[field.key]"
              @change="(newValue) => form.updateValue(field.key, newValue)"
          />
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
              v-if="form.step.value > 1"
              @click="$refs.stepper.previous()"
              flat
              style="margin-right: 30px"
              color="primary"
              :label="$t('back')"
              class="q-ml-sm" />
          <q-btn
              v-if="form.step.value < form.pages.value.length"
              @click="$refs.stepper.next()"
              color="primary"
              :label="$t('next_step')"
              :disable="!form.pageValid.value"
          />
          <q-btn
              v-if="form.step.value === form.pages.value.length"
              color="primary"
              :label="$t('finish_signup')"
              type="submit"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import * as form from 'src/helpers/form-helpers'

const account_fields = [FIELDS.EMAIL, FIELDS.USERNAME, FIELDS.PASSWORD_REPEAT]

form.pages.value = [
  {
    key: 'account_data',
    label: 'Account',
    fields: account_fields,
  },
  {
    key: 'personal_data',
    label: 'Personal',
    fields: [FIELDS.FULL_NAME,],
  },
  {
    key: 'address_data',
    label: 'Address',
    fields: [],
  },
  {
    key: 'authentication',
    label: 'Authentication',
    fields: [],
  },
  {
    key: 'interests',
    label: 'Interests',
    fields: [],
  },
]

</script>

<style scoped>

</style>
