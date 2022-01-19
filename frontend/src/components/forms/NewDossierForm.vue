<template>
  <q-form
    ref="formRef"
    greedy
    class="q-gutter-md"
  >
    <!-- Stepper (for multi-page forms) -->
    <q-stepper
      ref="stepper"
      v-model="form.step.value"
      class="column"
      active-color="primary"
      done-icon="done"
      style="min-height: 700px"
      animated
    >
      <!-- Form content -->
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
          <!-- Left-hand side -->
          <div class="col">
            <div
              v-for="leftSection in page.sectionsLHS"
              :key="leftSection.key">
              <strong class="q-py-xl q-my-xl">{{ leftSection.title }}</strong>
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

          <!-- Right-hand side -->
          <div class="col q-ml-lg  q-pl-lg">
            <div
              v-for="rightSection in page.sectionsRHS"
              :key="rightSection.key">
              <strong class="q-py-xl q-my-xl">{{ rightSection.title }}</strong>
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

        <q-separator style="margin: 24px 0 48px 0"/>

        <!-- Summary block for income page -->
        <div
          v-if="form.step.value === 4"
          class="row"
        >
          <!-- Left side: wage summary -->
          <div
            class="col"
            style="margin-right: 24px"
          >
            <strong>
              {{ $t('form_for_clients.eligible_income')}}
            </strong>
            <q-card
              class="q-pa-sm bg-green-2 text-right"
              style="margin: 12px 0 12px 0"
            >
              <strong>
                {{ eligibleIncome }}
              </strong>
            </q-card>
          </div>

          <!-- Right side: costs summary -->
          <div
            class="col"
            style="margin-left: 24px"
          >
            <strong>
              {{ $t('form_for_clients.costs')}}
            </strong>
            <q-card
              class="q-pa-sm bg-red-2 text-right"
              style="margin: 12px 0 12px 0"
            >
              <strong>
                {{ totalCosts }}
              </strong>
            </q-card>
          </div>
        </div>
      </q-step>

      <!-- Bottom navigation -->
      <template #navigation>
        <q-stepper-navigation style="position: absolute; bottom: 0">
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
</template>

<script setup lang="ts">
import {computed, inject, Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {Form} from 'src/helpers/form-helpers';
import {QForm} from 'quasar';
import {FIELDS} from 'src/data/FIELDS';
import {executeMutation} from 'src/helpers/data-helpers';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {CREATE_DOSSIER} from 'src/data/mutations/DOSSIER';

const $routerService: RouterService | undefined = inject('$routerService')

// Form component reference
const formRef: Ref<QForm | null> = ref(null)

const pages = [
  // First page: CRM Data
  {
    key: 'crm-data',
    label: i18n.global.t('employee_dashboard.customer'),
    sectionsLHS: [
      {
        key: 'crm-person',
        title: i18n.global.t('employee_dashboard.customer'),
        fields: [FIELDS.FULL_NAME, FIELDS.DATE_OF_BIRTH],
      },
      {
        key: 'crm-address',
        title: i18n.global.t('account_data.domicile_address'),
        fields: [FIELDS.ADDRESS],
      },
    ],
    sectionsRHS: [
      {
        key: 'crm-contact',
        title: i18n.global.t('form_for_clients.contact_info'),
        fields: [FIELDS.EMAIL, FIELDS.PHONE_NUMBER],
      },
    ]
  },

  // Second page: Property data
  {
    key: 'property',
    label: i18n.global.t('form_for_clients.property'),
    sectionsLHS: [
      {
        key: 'property-name',
        title: i18n.global.t('account_data.bank'),
        fields: [FIELDS.BANK],
      },
      {
        key: 'property-type',
        title: i18n.global.t('form_for_clients.property'),
        fields: [FIELDS.PROPERTY_TYPE],
      },
      {
        key: 'property-owner-occupied',
        title: ' ',
        fields: [FIELDS.OWNER_OCCUPIED],
      },
    ],
    sectionsRHS: [
      {
        key: 'property-purchase-detail',
        title: i18n.global.t('form_for_clients.purchase'),
        fields: [FIELDS.DATE_OF_PURCHASE, FIELDS.ENFEOFFMENT],
      },
    ]
  },

  // Third page: Calculations
  {
    key: 'calculations',
    label: i18n.global.t('form_for_clients.calculations'),
    sectionsLHS: [
      {
        key: 'calculation-data1',
        title: i18n.global.t('dashboards.mortgage'),
        fields: [FIELDS.MORTGAGE],
      },
    ],
    sectionsRHS: [
      {
        key: 'calculation-data2',
        title: ' ',
        fields: [FIELDS.BUILDING_LEASE],
      },
      {
        key: 'calculation-data3',
        title: ' ',
        fields: [FIELDS.RENOVATION],
      },
      {
        key: 'calculation-data4',
        title: ' ',
        fields: [FIELDS.AMORTISATION],
      },
    ]
  },

  // Fourth page: Assets
  {
    key: 'assets',
    label: i18n.global.t('form_for_clients.assets'),
    sectionsLHS: [
      {
        key: 'assets-data1',
        title: i18n.global.t('form_for_clients.income'),
        fields: [FIELDS.INCOME],
      },
      {
        key: 'assets-data2',
        title: i18n.global.t('form_for_clients.additional_income'),
        fields: [FIELDS.CHILD_ALLOWANCES, FIELDS.BONUS],
      },
    ],
    sectionsRHS: [
      {
        key: 'assets-data3',
        title: i18n.global.t('form_for_clients.costs'),
        fields: [
          FIELDS.LEASING,
          FIELDS.CREDIT,
          FIELDS.ALIMONY,
          FIELDS.VARIOUS,
          FIELDS.PROSECUTIONS,
          FIELDS.LOSS_CERTIFICATES
        ],
      },
    ]
  },
]
const form: Form = new Form(pages as Record<string, unknown>[])

/**
 * From the data given on the 'assets' page, calculate sum of eligible income
 */
const eligibleIncome = computed(() => {
  const grossIncomes = form.values.value.income as number[]|undefined
  const bonus = form.values.value.bonus as number|undefined
  const childAllowances = form.values.value.child_allowances as number|undefined

  if(grossIncomes && bonus && childAllowances){
    let sumOfIncomes = 0
    grossIncomes.forEach((income) => sumOfIncomes += income)

    const total = sumOfIncomes + parseInt(bonus) + parseInt(childAllowances)
    return `CHF ${total}`
  }

  return '-'
})

/**
 * From the data given on the 'assets' page, calculate sum of costs
 */
const totalCosts = computed(() => {
  const leasing = form.values.value.leasing as number|undefined
  const credit = form.values.value.credit as number|undefined
  const alimony = form.values.value.alimony as number|undefined
  const various = form.values.value.various as number|undefined

  if(leasing && credit && alimony && various){
    const total = parseInt(leasing) + parseInt(credit) + parseInt(alimony) + parseInt(various)
    return `CHF ${total}`
  }

  return '-'
})

/**
 * Upon validation, it creates a dossier in the database
 * @param {Record<string, unknown>} formData: The form's entered data
 * @async
 * @returns {void}
 */
async function onSubmit(formData: Record<string, Record<string, string>>) {
  // TODO: other params
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
