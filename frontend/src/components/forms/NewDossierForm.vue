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
      style="min-height: 870px"
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
        <!-- Main form content (pages 1-4) -->
        <div
          v-if="form.step.value < form.pages.value.length"
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

          <!-- Sum block for income page -->
          <div
            v-if="form.step.value === 4"
            class="row"
          >
            <!-- Left side: income summary -->
            <div
              class="col"
              style="margin-right: 24px"
            >
              <strong>
                {{ $t('form_for_clients.total_income')}}
              </strong>
              <q-card
                class="q-pa-sm bg-green-2 text-right"
                style="margin: 12px 0 12px 0"
                flat
              >
                <strong>
                  {{ totalIncome ? `CHF ${totalIncome}` : '-' }}
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
                flat
              >
                <strong>
                  {{ totalExpenses ? `CHF ${totalExpenses}` : '-' }}
                </strong>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Summary page (final page before submit) -->
        <div
          v-else
          class="column"
        >
          <!-- Eligible salary -->
          <SummaryField
            :label="$t('form_for_clients.eligible_income')"
            :content="eligibleIncome ? `CHF ${eligibleIncome}` : '-' "
            value-type="positive"
          />

          <!-- Costs per year -->
          <SummaryField
            :label="$t('form_for_clients.costs_per_year')"
            :content="totalCosts ? `CHF ${totalCosts}` : '-' "
            value-type="negative"
          />

          <!-- Affordability -->
          <SummaryField
            :label="$t('form_for_clients.affordability')"
            :content="affordability ? `${affordability}%` : '-' "
          />

          <q-separator style="margin: 24px 0 24px 0"/>

          <!-- Estimated value range -->
          <SummaryField
            :label="$t('form_for_clients.market_value_between')"
            :content="valueEstimate.low ? `CHF ${valueEstimate.low }` : '-' "
            :second-content="valueEstimate.high ? `CHF ${valueEstimate.high }` : '-' "
            value-type="positive"
          />

          <q-separator style="margin: 24px 0 24px 0"/>

          <!-- Enfeoffment -->
          <SummaryField
            :label="$t('form_for_clients.enfeoffment_between')"
            :content="enfeoffmentEstimate.low ? `${enfeoffmentEstimate.low}%` : '-' "
            :second-content="enfeoffmentEstimate.high ? `${enfeoffmentEstimate.high}%` : '-' "
            bold
          />
        </div>
      </q-step>

      <!-- Bottom navigation -->
      <template #navigation>
        <q-stepper-navigation style="position: absolute; bottom: 0">
          <!-- Regular navigation -->
          <div
            v-if="form.step.value < form.pages.value.length"
            class="row"
          >
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
              color="primary"
              :label="$t('buttons.next_step')"
              :disable="!form.pageValid.value"
              @click="$refs.stepper.next()"
            />
          </div>


          <!-- Finish buttons -->
          <div
            v-if="form.step.value === form.pages.value.length"
            class="row"
          >
            <q-btn
              v-if="form.step.value > 1"
              color="primary"
              :label="$t('buttons.back')"
              flat
              class="q-ml-sm"
              @click="$refs.stepper.previous()"
            />
            <q-btn
              :label="$t('buttons.discard')"
              color="negative"
              class="q-ml-sm"
              flat
            />
            <q-btn
              :label="$t('buttons.upload_documents')"
              color="primary"
              icon="upload"
              class="q-ml-sm"
              outline
            />
            <q-btn
              :label="$t('buttons.save_and_print')"
              color="primary"
              icon="print"
              class="q-ml-sm"
            />
          </div>
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
import SummaryField from 'components/forms/fields/dossier_creation/SummaryField.vue';

const $routerService: RouterService | undefined = inject('$routerService')

// Form component reference
const formRef: Ref<QForm | null> = ref(null)

// Form Pages
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
        fields: [
          FIELDS.CHILD_ALLOWANCES,
          FIELDS.BONUS,
          FIELDS.ASSETS
        ],
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

  // Fifth page: Summary
  {
    key: 'summary',
    label: i18n.global.t('form_for_clients.summary'),
    sections: [
      {
        key: 'summary',
        title: i18n.global.t('form_for_clients.summary'),
        fields: [],
      },
    ],
  },
]

// Form instance
const form: Form = new Form(pages as Record<string, unknown>[])

/**
 * Total income
 */
const totalIncome = computed(() => {
  const grossIncomes = form.values.value.income as number[]|undefined
  const bonus = form.values.value.bonus as number|undefined
  const childAllowances = form.values.value.child_allowances as number|undefined
  const assets = form.values.value.assets as number|undefined

  if(grossIncomes && bonus && childAllowances && assets){
    let sumOfIncomes = 0
    grossIncomes.forEach((income) => sumOfIncomes += income)

    return sumOfIncomes + parseInt(bonus) + parseInt(childAllowances) + parseInt(assets)
  }

  return null
})

/**
 * Sum of expenses
 */
const totalExpenses = computed(() => {
  const leasing = form.values.value.leasing as number|undefined
  const credit = form.values.value.credit as number|undefined
  const alimony = form.values.value.alimony as number|undefined
  const various = form.values.value.various as number|undefined

  if(leasing && credit && alimony && various){
    return parseInt(leasing) + parseInt(credit) + parseInt(alimony) + parseInt(various)
  }

  return null
})

/**
 * Sum of eligible income (total income minus expenses)
 */
const eligibleIncome = computed(() => {
  return totalIncome.value - totalExpenses.value
})

/**
 * Sum of yearly costs (used for affordability)
 * Formula: 5% interest on mortgage sum + 1% of highest market value estimation of property + amortisation costs
 */
const totalCosts = computed(() => {
  // Mortgage amount
  const mortgage = (form.values.value.enfeoffment as Record<string, number>|undefined)?.currentValueOfMortgage

  // TODO adapt: take from CSV-calculated value here
  // Higher market value estimate
  const marketValueEstimation = (form.values.value.enfeoffment as Record<string, number>|undefined)?.marketValueEstimation

  // Yearly amortisation cost
  const amortisation = (form.values.value.amortisation as Record<string, number>|undefined)?.amortisationAmount ?? 0

  // 5% yearly mortgage interest
  const interestRate = 0.05

  // Ensure all required values are given
  if(mortgage && marketValueEstimation){ // TODO && all others
    return (mortgage * interestRate) + (0.01 * marketValueEstimation) + amortisation
  }

  return null
})

/**
 * Mortgage affordability
 */
const affordability = computed(() => {

  // Ensure all required values are given
  if(totalCosts.value && eligibleIncome.value){

    // TODO warnings
    return (totalCosts.value / eligibleIncome.value * 100).toFixed(2)
  }

  return null
})

/**
 * High/low market value estimations (based on value gain and customer estimate)
 */
const valueEstimate = computed(() => {
  // Customer market value estimate
  const customerEstimate = (form.values.value.enfeoffment as Record<string, number>|undefined)?.marketValueEstimation

  // Invalid, data missing
  if(!customerEstimate) {
    // TODO throw error
    return {
      low: null,
      high: null
    }
  }

  // TODO adapt: calculate from CSV
  const highEstimate = Math.round(customerEstimate * 1.14)

  // Return as array (low & high estimate)
  return {
    low: customerEstimate,
    high: highEstimate
  }
})

/**
 * High/low enfeoffment estimations (in percent)
 */
const enfeoffmentEstimate = computed(() => {
  // Mortgage amount
  const mortgage = (form.values.value.enfeoffment as Record<string, number>|undefined)?.currentValueOfMortgage

  // Invalid, data missing
  if(!valueEstimate.value || !mortgage) {
    // TODO throw error
    return {
      low: null,
      high: null
    }
  }

  // Return as array (low & high estimate)
  return {
    low: (mortgage/valueEstimate.value.low * 100).toFixed(2),
    high: (mortgage/valueEstimate.value.high * 100).toFixed(2)
  }

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
