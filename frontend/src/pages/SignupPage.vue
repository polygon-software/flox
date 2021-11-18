<template>
  <q-page class="flex flex-center">
    <div
      class="column q-pa-sm"
      style="width: 500px;"
    >
      <q-form
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
                @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
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
                @click="onSignup"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { FIELDS } from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import {i18n} from 'boot/i18n';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {inject} from 'vue';
import {executeMutation} from 'src/helpers/data-helpers';
import {CREATE_COMPANY} from 'src/data/mutations/COMPANY';

const $routerService: RouterService|undefined = inject('$routerService')

/**
 * This component enables a multi-step sign up form using Quasar's q-stepper. In "form.pages.value" the different
 * steps are defined.The fields a page contains are defined in the fields variable.
 * Common fields can be found under "src/data/FIELDS".
 * All fields of a page must be completed before the next page can be accessed.
 */

const account_fields = [
  FIELDS.FULL_NAME,
  FIELDS.LANGUAGE,
  FIELDS.DOMICILE_ADDRESS,
  FIELDS.CORRESPONDENCE_ADDRESS,
  FIELDS.PHONE_NUMBER,
  FIELDS.EMAIL,
  FIELDS.COMPANY_DATA,
  FIELDS.CONDITIONS
]

const form = new Form()

form.pages.value = [
  {
    key: 'company',
    label: i18n.global.t('signup'),
    fields: account_fields,
  },
]


/**
 * TODO docstrings
 */
async function onSignup(){
  // TODO verify AGBs checked

  console.log('OnSignup with arguments', form.values.value)

  const input: Record<string, Record<string, unknown>> = form.values.value

  // If no correspondence given, is same as domicile address
  if(!input.correspondence_address){
    input.correspondence_address = input.domicile_address;
  }

  // Get name object, containing first_name and last_name
  const person_name_object: Record<string, string> = input.full_name as Record<string, string>
  const person_name = `${person_name_object.first_name} ${person_name_object.last_name}`

  const branch_structure_object: Record<string, unknown> = input.company_data.branch_structure as Record<string, unknown>
  console.log('BSO:', branch_structure_object)
  const branch_structure: boolean = branch_structure_object.value as boolean

  // TODO after cleanup
  await executeMutation(
    CREATE_COMPANY,
    {
      company_name: input.company_data.company_name,
      person_name: person_name,
      language: input.language,
      uid: input.company_data.uid,
      domicile_address: input.domicile_address,
      correspondence_address: input.correspondence_address,
      phone: input.phone_number,
      email: input.email,
      branch_structure: branch_structure
    }
  )
  await $routerService?.routeTo(ROUTES.SUCCESS)
  return;
}

</script>

<style scoped>

</style>
