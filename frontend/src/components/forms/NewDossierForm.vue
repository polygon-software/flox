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
      @update:model-value="onPageChange"
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
                <!-- NOTE: 'totalAmount' is passed because MortgageFields needs it for calculation -->
                <component
                  :is="field.component"
                  v-for="field in leftSection.fields"
                  :key="field.key"
                  v-bind="field.attributes"
                  v-model="form.values.value[field.key]"
                  :initial-value="form.values.value[field.key]"
                  :total-amount="mortgage"
                  @change="(newValue) => form.updateValue(field.key, newValue)"
                  @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
                  @warning="nonArrangeable = true"
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
                  :initial-value="form.values.value[field.key]"
                  @change="(newValue) => form.updateValue(field.key, newValue)"
                  @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
                  @warning="nonArrangeable = true"
                />
              </div>
            </div>
          </div>

          <q-separator
            v-if="form.step.value === 4"
            style="margin: 24px 0 48px 0"
          />

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

          <!-- Mortgage Volume -->
          <SummaryField
            :label="$t('account_data.mortgage_volume')"
            :content="mortgage ? `CHF ${mortgage}` : '-' "
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
            :caption="enfeoffmentRank(enfeoffmentEstimate.low)"
            :second-caption="enfeoffmentRank(enfeoffmentEstimate.high)"
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

          <!-- End-of-form buttons -->
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
              @click="onDiscard"
            />
            <q-btn
              :label="$t('buttons.save_and_print')"
              color="primary"
              icon="print"
              class="q-ml-sm"
              @click="onSubmit"
            />
          </div>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-form>
</template>

<script setup lang="ts">
import {computed, inject, onMounted, Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {Form} from 'src/helpers/form-helpers';
import {QForm, useQuasar} from 'quasar';
import {FIELDS} from 'src/data/FIELDS';
import {executeMutation, executeQuery} from 'src/helpers/data-helpers';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {CREATE_DOSSIER} from 'src/data/mutations/DOSSIER';
import SummaryField from 'components/forms/fields/dossier_creation/SummaryField.vue';
import WarningDialog from 'components/dialogs/WarningDialog.vue';
import {ALL_BANK_NAMES} from 'src/data/queries/QUERIES';

const $routerService: RouterService | undefined = inject('$routerService')
const $q = useQuasar()

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
        fields: [
          FIELDS.FULL_NAME,
          FIELDS.DATE_OF_BIRTH
        ],
      },
      {
        key: 'crm-address',
        title: i18n.global.t('account_data.domicile_address'),
        fields: [
          FIELDS.ADDRESS
        ],
      },
    ],
    sectionsRHS: [
      {
        key: 'crm-contact',
        title: i18n.global.t('form_for_clients.contact_info'),
        fields: [
          FIELDS.EMAIL,
          FIELDS.PHONE_NUMBER
        ],
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
        fields: [
          FIELDS.DATE_OF_PURCHASE,
          FIELDS.ENFEOFFMENT
        ],
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
        fields: [
          FIELDS.INCOME
        ],
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

// Non-arrangeable tag
const nonArrangeable = ref(false)

// Bank list
const bankOptions = ref([])

/**
 * Mortgage volume
 */
const mortgage = computed(() => {
  return Math.round((form.values.value.enfeoffment as Record<string, number>|undefined)?.currentValueOfMortgage) ?? null
})

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

    return Math.round(sumOfIncomes + parseInt(bonus) + parseInt(childAllowances) + parseInt(assets))
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
    return Math.round(parseInt(leasing) + parseInt(credit) + parseInt(alimony) + parseInt(various))
  }

  return null
})

/**
 * Sum of eligible income (total income minus expenses)
 */
const eligibleIncome = computed(() => {
  // Ensure all needed values are present
  if(!totalIncome.value || !totalExpenses.value){
    return null
  }

  return Math.round(totalIncome.value - totalExpenses.value)
})

/**
 * Sum of yearly costs (used for affordability)
 * Formula: 5% interest on mortgage sum + 1% of highest market value estimation of property + amortisation costs
 */
const totalCosts = computed(() => {
  // TODO adapt: take from CSV-calculated value here
  // Higher market value estimate
  const marketValueEstimation = (form.values.value.enfeoffment as Record<string, number>|undefined)?.marketValueEstimation

  // Yearly amortisation cost
  const amortisation = (form.values.value.amortisation as Record<string, number>|undefined)?.amortisationAmount ?? 0

  // 5% yearly mortgage interest
  const interestRate = 0.05

  // Ensure all required values are given
  if(mortgage.value && marketValueEstimation){
    return Math.round((mortgage.value * interestRate) + (0.01 * marketValueEstimation) + amortisation)
  }

  return null
})

/**
 * Mortgage affordability in percent
 */
const affordability = computed(() => {

  // Ensure all required values are given
  if(totalCosts.value && eligibleIncome.value){
    return (totalCosts.value / eligibleIncome.value * 100).toFixed(2)
  }

  return null
})

/**
 * High/low market value estimations (based on value gain and customer estimate)
 */
const valueEstimate = computed(() => {
  // Customer market value estimate
  const customerEstimate = Math.round((form.values.value.enfeoffment as Record<string, number>|undefined)?.marketValueEstimation)

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
  // Invalid, data missing
  if(!valueEstimate.value || !mortgage.value) {
    // TODO throw error
    return {
      low: null,
      high: null
    }
  }

  // Return as array (low & high estimate)
  return {
    low: (mortgage.value/valueEstimate.value.low * 100).toFixed(2),
    high: (mortgage.value/valueEstimate.value.high * 100).toFixed(2)
  }

})

// Upon mounting, get list of banks
onMounted(async () => {
  // Execute query
  const banksQuery = await executeQuery(ALL_BANK_NAMES)
  const bankList: Record<string, string>[] = banksQuery.data.getBankList

  // Format so option group can use it
  bankOptions.value = bankList.map((bank: Record<string, string>) => {
    return {
      label: `${bank.name} (${bank.abbreviation})`
    }
  })
})

/**
 * Upon page change, validate whether warning dialogs must be shown
 * @returns {void}
 */
function onPageChange(){
  // When going to final page, validate affordability
  if(form.step.value === form.pages.value.length){
    let affordabilityWarning
    let enfeoffmentWarning

    // Trigger warning depending on affordability rating
    if(affordability.value > 35){
      affordabilityWarning = i18n.global.t('warnings.affordability_impossible')
    } else if(affordability.value > 33 && affordability.value <= 35){
      affordabilityWarning = i18n.global.t('warnings.affordability_critical')
    }

    // Trigger warning depending on enfeoffment ratio (if >80%), use low value because its enfeoffment is higher
    if(enfeoffmentEstimate.value.low > 80){
      enfeoffmentWarning = i18n.global.t('warnings.enfeoffment_warning')
    }

    // Affordability warning
    if(affordabilityWarning){
      $q.dialog({
        component: WarningDialog,
        componentProps: {
          description: affordabilityWarning
        }
      })

      // Mark as non-arrangeable
      nonArrangeable.value = true
    }

    // Enfeoffment warning
    if(enfeoffmentWarning){
      $q.dialog({
        component: WarningDialog,
        componentProps: {
          description: enfeoffmentWarning
        }
      })

      // Mark as non-arrangeable
      nonArrangeable.value = true
    }
  }
}

/**
 * Opens a dialog for confirming discarding all data
 * @returns {void}
 */
function onDiscard(){
  $q.dialog({
    component: WarningDialog,
    componentProps: {
      description: i18n.global.t('form_for_clients.discard_dossier'),
      okLabel: i18n.global.t('buttons.cancel'),
      showDiscard: true
    }
  }).onCancel(() => {
    void $routerService?.routeTo(ROUTES.EMPLOYEE_DASHBOARD)
  })
}

/**
 * Upon validation, it creates a dossier in the database
 * @param {Record<string, unknown>} formData: The form's entered data
 * @async
 * @returns {void}
 */
async function onSubmit(formData: Record<string, Record<string, string>>) {
  const firstName = formData.full_name.first_name
  const lastName = formData.full_name.last_name
  const address =  formData.address
  const email = formData.email
  const phone = formData.phone_number
  const bank =  formData.bank

  // TODO add ALL values!!
  // if([firstName, lastName, address, email].some((value) => value === null || value === undefined)){
  //   // TODO show error popup
  //   throw new Error('FORM INCOMPLETE')
  // }

  // Creates a dossier
  // await executeMutation(CREATE_DOSSIER, {
  //   first_name: firstName,
  //   last_name: lastName,
  //   correspondence_address: address,
  //   email: email,
  //   phone: phone, // TODO on mutation
  //   original_bank_name: bank,
  //   original_bank_abbreviation: formData.original_bank_abbreviation,
  //   born: formData.born,
  //   property_address: formData.property_address,
  //   loan_sum: formData.loan_sum
  // })

  // TODO: route to final document
  await $routerService?.routeTo(ROUTES.EMPLOYEE_DASHBOARD)
}

/**
 * Gets the rank for a given enfeoffment rate
 * @param {number} rate - enfeoffment rate in percent
 * @returns {string} - rank string
 */
function enfeoffmentRank(rate){
  if(rate <= 66){
    return i18n.global.t('form_for_clients.enfeoffment_first_rank')
  } else if(rate > 66 && rate <= 80){
    return i18n.global.t('form_for_clients.enfeoffment_second_rank')
  }
  return i18n.global.t('form_for_clients.enfeoffment_too_high')
}

</script>
