<template>
  <q-page class="flex flex-center">
    <div
      class="column q-pa-sm"
      style="width: 700px;"
    >
      <q-form
        ref="formRef"
        greedy
        class="q-gutter-md"
      >
        <!-- Stepper (for multi-page forms) -->
        <q-stepper
          ref="stepper"
          v-model="form.step.value"
          active-color="primary"
          done-icon="done"
          animated
        >
          <q-step
            v-for="(page, index) in form.pages.value"
            :key="page.key"
            :name="index+1"
            :prefix="index+1"
            :title="page.label"
            :done="form.step.value > index"
          >
            <div
              class="row">
              <div class="col">
                <div
                  v-for="leftSection in page.sectionsLHS"
                  :key="leftSection.key">
                  <h7 class="q-py-xl q-my-xl">{{ leftSection.title }}</h7>
                  <component
                    :is="field.component"
                    v-for="field in leftSection.fields"
                    :key="field.key"
                    v-bind="field.attributes"
                    v-model="form.values.value[field.key]"
                    @change="(newValue) => form.updateValue(field.key, newValue)"
                    @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
                  />
                </div>
              </div>
              <div class="col q-ml-lg  q-pl-lg">
                <div
                  v-for="rightSection in page.sectionsRHS"
                  :key="rightSection.key">
                  <h7 class="q-py-xl q-my-xl">{{ rightSection.title }}</h7>
                  <component
                    :is="field.component"
                    v-for="field in rightSection.fields"
                    :key="field.key"
                    v-bind="field.attributes"
                    v-model="form.values.value[field.key]"
                    @change="(newValue) => form.updateValue(field.key, newValue)"
                    @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
                  />
                </div>
              </div>
            </div>

          </q-step>
          <template #navigation>
            <q-stepper-navigation>
              <q-btn
                v-if="form.step.value > 1"
                color="primary"
                :label="$t('buttons.back')"
                flat
                style="margin-right: 30px"
                class="q-ml-sm"
                @click="$refs.stepper.previous()"
              />
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
                @click="onSubmit"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import {inject, Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {Form} from 'src/helpers/form-helpers';
import {QForm} from 'quasar';
import {FIELDS} from 'src/data/FIELDS';
import {executeMutation} from 'src/helpers/data-helpers';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {ErrorService} from 'src/services/ErrorService';
import {CREATE_DOSSIER} from 'src/data/mutations/DOSSIER';

const $routerService: RouterService | undefined = inject('$routerService')
const $errorService: ErrorService | undefined = inject('$errorService')

const formRef: Ref<QForm | null> = ref(null)


const realEstateFields = [
  FIELDS.FULL_NAME,
  FIELDS.DATE_OF_BIRTH,
  FIELDS.PHONE_NUMBER,
  FIELDS.EMAIL,
  FIELDS.ADDRESS,
]

const pages = [
  {
    key: 'crm-data',
    label: i18n.global.t('employee_dashboard.customer'),
    sectionsLHS: [
      {
        key: 'crm-data1',
        title: i18n.global.t('employee_dashboard.customer'),
        fields: [FIELDS.FULL_NAME, FIELDS.DATE_OF_BIRTH],
      },
      {
        key: 'crm-data2',
        title: i18n.global.t('account_data.domicile_address'),
        fields: [FIELDS.ADDRESS],
      },
    ],
    sectionsRHS: [
      {
        key: 'crm-data3',
        title: i18n.global.t('form_for_clients.contact_info'),
        fields: [FIELDS.EMAIL, FIELDS.PHONE_NUMBER],
      },
    ]
  },
  {
    key: 'property',
    label: i18n.global.t('form_for_clients.property'),
    sectionsLHS: [
      {
        key: 'property-data1',
        title: i18n.global.t('account_data.bank'),
        fields: [FIELDS.BANK],
      },
      {
        key: 'property-data2',
        title: i18n.global.t('form_for_clients.property'),
        fields: [FIELDS.PROPERTY_TYPE],
      },
      {
        key: 'property-data3',
        title: i18n.global.t('form_for_clients.owner_occupied'),
        fields: [FIELDS.OWNER_OCCUPIED],
      },
    ],
    sectionsRHS: [
      {
        key: 'property-data4',
        title: i18n.global.t('form_for_clients.purchase'),
        fields: [FIELDS.DATE_OF_PURCHASE, FIELDS.PRICE, FIELDS.MARKET_VALUE_ESTIMATION, FIELDS.CURRENT_VALUE_OF_MORTGAGE, FIELDS.ENFEOFFMENT],
      },
    ]
  },
]
const form: Form = new Form(pages as Record<string, unknown>[])

/**
 * Upon validation, it creates a dossier in the database
 * @param {Record<string, unknown>} formData: The form's entered data
 * @async
 * @returns {void}
 */
async function onSubmit(formData: Record<string, Record<string, string>>) {
  const email: string = formData.email.toString()
  if (email === null || email === undefined) {
    $errorService?.showErrorDialog(new Error(i18n.global.t('errors.missing_attributes')))
  }

  // Creates a dossier
  await executeMutation(CREATE_DOSSIER, {
    first_name: formData.full_name.first_name,
    last_name: formData.full_name.last_name,
    correspondence_address: formData.address,
    email: formData.email,
    original_bank_name: formData.original_bank_name,
    original_bank_abbreviation: formData.original_bank_abbreviation,
    born: formData.born,
    property_address: formData.property_address,
    loan_sum: formData.loan_sum
  })

  // TODO: route to final document
  await $routerService?.routeTo(ROUTES.EMPLOYEE_DASHBOARD)
}


</script>
