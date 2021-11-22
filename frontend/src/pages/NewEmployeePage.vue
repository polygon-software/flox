<template>
  <q-page class="flex flex-center">
    <q-card class="square q-pa-md q-ma-md">

      <div
        class="column q-pa-sm"
        style="width: 600px;"
      >
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-stepper
            v-model="form.step.value"
            ref="stepper"
            animated
            active-color="primary"
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
              <div class="row justify-between">
                <q-btn
                  @click="backToManDashboard"
                  flat
                  style="margin-left: 30px; margin-bottom: 20px"
                  color="primary"
                  :label="$t('back')"
                  class="q-ml-sm"/>
                <q-btn
                  color="green"
                  style="margin-right: 30px; margin-bottom: 20px"
                  :label="$t('finish_signup')"
                  type="submit"
                />
              </div>
            </template>
          </q-stepper>
        </q-form>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import {Form} from 'src/helpers/form-helpers'
import {i18n} from 'boot/i18n';

/**
 * This component allows the management to register new employees, the fields can easily be changed with the
 * account_fields array. Once a new employee has been registered, the user will be redirected to the management
 * dashboard.
 */

const emit = defineEmits(['submit'])

const account_fields = [
  FIELDS.SALUTATION,
  FIELDS.FULL_NAME,
  FIELDS.COMPANY_FUNCTION,
  FIELDS.PHONE_NUMBER,
  FIELDS.EMAIL,
]

const form = new Form()

form.pages.value = [
  {
    key: 'company',
    label: i18n.global.t('employee_signup'),
    fields: account_fields,
  },
]

/**
 * Emits the 'submit' event, containing the form's data and redirects somewhere
 */
function onSubmit(): void {
  //TODO: Send to SOI
  //TODO: redirect to something ?
  emit('submit', form.values.value)
}

/**
 * Directs user back to the management dashboard
 */
function backToManDashboard(): void {
  //TODO: Redirect to the management dashboard
}
</script>

<style scoped>

</style>
