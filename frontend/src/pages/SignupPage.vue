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
 * Registers a new authentication using the given data and opens the corresponding e-mail verification dialog
 * @param username {string} - the authentication's chosen username
 * @param email {string} - the authentication's e-mail address
 * @param password_repeat {string} - the authentication's chosen password
 */
async function onSignup({username, email, password_repeat}:{username: string, email: string, password_repeat:string}): Promise<void>{
  // TODO verify AGBs
  // TODO rework for SOI-specific info: Don't actually sign up, but only create on database
  //await $authService.signUp(username, email, password_repeat);
  // await executeMutation(
  //   CREATE_COMPANY,
  //   {
  //     name: 'testcompany'
  //     // TODO
  //   }
  // )
  await $routerService?.routeTo(ROUTES.SUCCESS)
  return;
}

</script>

<style scoped>

</style>
