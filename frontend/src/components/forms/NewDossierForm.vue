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
      style="min-height: 600px;"
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
          v-if="form.step.value < form.pages.value.length-1"
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
                <!-- NOTE: Because of the bank list, we separately pass 'options' prop -->
                <!-- NOTE: these are only done in the LHS section since these fields are LHS! -->
                <component
                  :is="field.component"
                  v-for="field in leftSection.fields"
                  :key="field.key"
                  v-bind="field.attributes"
                  v-model="form.values.value[field.key]"
                  :validate-zip="field.key === 'address' ? true : null"
                  :initial-value="form.values.value[field.key]"
                  :options="field.key === 'bank' ? bankOptions : field.attributes.options"
                  :total-amount="mortgage"
                  @change="(newValue) => form.updateValue(field.key, newValue)"
                  @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
                  @warning="(val) => setWarning(val, true)"
                  @no-warning="(val) => setWarning(val, false)"
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
                  @warning="(val) => setWarning(val, true)"
                  @no-warning="(val) => setWarning(val, false)"
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
                  {{ totalIncome !== null && totalIncome !== undefined ? `CHF ${totalIncome.toLocaleString('de-ch')}` : '-' }}
                </strong>
              </q-card>
            </div>

            <!-- Right side: costs summary -->
            <div
              class="col"
              style="margin-left: 24px"
            >
              <strong>
                {{ $t('form_for_clients.costs_per_year')}}
              </strong>
              <q-card
                class="q-pa-sm bg-red-2 text-right"
                style="margin: 12px 0 12px 0"
                flat
              >
                <strong>
                  {{ totalExpenses !== null && totalExpenses !== undefined ? `CHF ${totalExpenses.toLocaleString('de-ch')}` : '-' }}
                </strong>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Summary page (final page before submit) -->
        <div
          v-else-if="form.step.value === form.pages.value.length - 1"
          class="column"
          style="margin-bottom: 80px"
        >
          <!-- Eligible salary -->
          <SummaryField
            :label="$t('form_for_clients.eligible_income')"
            :content="eligibleIncome ? `CHF ${eligibleIncome.toLocaleString('de-ch')}` : '-' "
            value-type="positive"
          />

          <!-- Costs per year -->
          <SummaryField
            :label="$t('form_for_clients.costs_per_year')"
            :content="valueEstimateLoading ? $t('general.loading') : totalCosts ? `CHF ${totalCosts.toLocaleString('de-ch')}` : '-' "
            value-type="negative"
            :show-hover-text="true"
            :hover-text="$t('form_for_clients.formula')"
            :second-hover-text="totalCostsAsString.toLocaleString('de-ch')"
          />

          <!-- Mortgage Volume -->
          <SummaryField
            :label="$t('account_data.mortgage_volume')"
            :content="mortgage ? `CHF ${mortgage.toLocaleString('de-ch')}` : '-' "
          />

          <!-- Affordability -->
          <SummaryField
            :label="$t('form_for_clients.affordability')"
            :content="valueEstimateLoading ? $t('general.loading') : affordability ? `${affordability}%` : '-' "
          />

          <q-separator style="margin: 24px 0 24px 0"/>

          <!-- Estimated value range -->
          <SummaryField
            :label="$t('form_for_clients.market_value_between')"
            :content="valueEstimate && valueEstimate.low ? `CHF ${valueEstimate.low.toLocaleString('de-ch') }` : '-'"
            :second-content="prognosisAvailable ? (valueEstimateLoading ? $t('general.loading') : valueEstimate && valueEstimate.high ? `CHF ${valueEstimate.high.toLocaleString('de-ch')}` : '-'): $t('dossier.no_prognosis') "
            :caption="$t('dossier.customer_value')"
            :second-caption="$t('dossier.estimated_market_value')"
            value-type="positive"
            bold
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

          <!-- Warning card if non-arrangeable -->
          <q-card
            v-if="nonArrangeable"
            class="row q-pa-md text-white bg-red-5 justify-between items-center"
            style="width: 500px; margin-top: 32px"
          >
            <q-icon
              class="col-3"
              name="warning"
              color="white"
              size="80px"
            />
            <strong class="col">
              {{ $t('warnings.non_arrangeable') }}
            </strong>
          </q-card>
        </div>

        <!-- PDF preview page -->
        <div v-else>

          <!-- Page Print Preview -->
          <DossierFinalDocumentPreview :dossier="dossierObject"/>
        </div>
      </q-step>

      <!-- Bottom navigation -->
      <template #navigation>
        <q-stepper-navigation style="width: 100%; position: absolute; bottom: 0">
          <!-- Regular navigation -->
          <div
            class="row full-width justify-between"
          >
            <!-- Left-side buttons (prev/next, print) -->
            <div>
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
                :disable="!form.pageValid.value || bankOptions.length === 0"
                @click="$refs.stepper.next()"
              />
              <q-btn
                v-else
                :label="$t('buttons.save_and_print')"
                color="primary"
                icon="print"
                class="q-ml-sm"
                :disable="valueEstimateLoading || hasSubmitted"
                @click="onSubmit"
              />
            </div>

            <!-- Discard button -->
            <q-btn
              :label="$t('buttons.discard')"
              color="negative"
              class="q-ml-sm"
              flat
              @click="onDiscard"
            />
          </div>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-form>
</template>

<script setup lang="ts">
import {computed, ComputedRef, inject, onMounted, Ref, ref} from 'vue';
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
import {ErrorService} from 'src/services/ErrorService';
import {ALL_BANK_NAMES, BANK_NAME_SUGGESTIONS} from 'src/data/queries/BANK';
import {DOSSIER_WARNING} from 'app/definitions/ENUMS';
import axios from 'axios';
import {dateToInputString} from 'src/helpers/date-helpers';
import {getAuthToken} from 'src/helpers/cookie-helpers';
import DossierFinalDocumentPreview from 'components/dossier/DossierFinalDocumentPreview.vue';
import {AuthenticationService} from 'src/services/AuthService';

const $routerService: RouterService | undefined = inject('$routerService')
const $errorService: ErrorService|undefined = inject('$errorService')
const $authService: AuthenticationService|undefined = inject('$authService')

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
        title: i18n.global.t('form_for_clients.costs_per_year'),
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

  // Sixth page: Preview
  {
    key: 'preview',
    label: i18n.global.t('form_for_clients.preview'),
    sections: [
      {
        key: 'preview',
        title: i18n.global.t('form_for_clients.preview'),
        fields: [],
      },
    ],
  },
]

// Form instance
const form: Form = new Form(pages as Record<string, unknown>[])

// Triggered warnings (used for computing non-arrangeable status)
const warnings: Ref<DOSSIER_WARNING[]> = ref([])

// Non-arrangeable tag: if any warnings present, mark as non-arrangeable
const nonArrangeable = computed(() => {
  return warnings.value.length > 0
})

// Bank list
const bankOptions: Ref<Record<string, unknown>[]> = ref([])

// Value estimate high/low
const valueEstimate: Ref<null|Record<string, number>> = ref(null)

// Whether the value estimate is currently being loaded from the backend
const valueEstimateLoading = ref(false)

// Whether the from has been submitted (to prevent multi-submit)
const hasSubmitted = ref(false)

// Whether the region of the given zip code is in the value_development table
const prognosisAvailable = ref(true)

/**
 * Mortgage volume
 */
const mortgage = computed(() => {
  return form.values.value.enfeoffment ? Math.round((form.values.value.enfeoffment as Record<string, number>)?.currentValueOfMortgage) : null
})

/**
 * Total income
 */
const totalIncome = computed(() => {
  const grossIncomes = form.values.value.income as number[]|undefined
  const bonus = form.values.value.bonus as string|undefined
  const childAllowances = form.values.value.child_allowances as string|undefined

  if(grossIncomes && bonus && childAllowances){
    let sumOfIncomes = 0
    grossIncomes.forEach((income) => sumOfIncomes += income)

    return Math.round(sumOfIncomes + parseInt(bonus) + parseInt(childAllowances))
  }

  return null
})

/**
 * Sum of expenses
 */
const totalExpenses = computed(() => {
  const leasing = form.values.value.leasing as string|undefined
  const credit = form.values.value.credit as string|undefined
  const alimony = form.values.value.alimony as string|undefined
  const various = form.values.value.various as string|undefined

  if([leasing, credit, alimony, various].every((value) => value !== undefined && typeof value === 'string')){
    return Math.round(parseInt(leasing) + parseInt(credit) + parseInt(alimony) + parseInt(various))
  }

  return null
})

/**
 * Sum of eligible income (total income minus expenses)
 */
const eligibleIncome = computed(() => {
  // Ensure all needed values are present
  if(totalIncome.value === null || totalExpenses.value === null ){
    return null
  }

  return Math.round(totalIncome.value - totalExpenses.value)
})

/**
 * Sum of yearly costs (used for affordability)
 * Formula: 5% interest on mortgage sum + 1% of highest market value estimation of property + amortisation costs
 */
const totalCosts = computed(() => {
  // Value estimate is needed for calculation
  if(!valueEstimate.value){
    return null
  }

  // Higher market value estimate
  const marketValueEstimation = valueEstimate.value.high

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

const totalCostsAsString = computed(() => {
  // Value estimate is needed for calculation
  if(!valueEstimate.value){
    return ''
  }

  // Higher market value estimate
  const marketValueEstimation = valueEstimate.value.high

  // Yearly amortisation cost
  const amortisation = (form.values.value.amortisation as Record<string, number>|undefined)?.amortisationAmount ?? 0

  // 5% yearly mortgage interest
  const interestRate = 0.05

  // Ensure all required values are given
  if(mortgage.value && marketValueEstimation){
    return `(${mortgage.value} * ${interestRate}) + (0.01 * ${marketValueEstimation}) + ${amortisation}`
  }

  return ''
})

/**
 * Mortgage affordability in percent
 */
const affordability: ComputedRef<number|null> = computed(() => {

  // Ensure all required values are given
  if(totalCosts.value && eligibleIncome.value){
    return parseFloat((totalCosts.value / eligibleIncome.value * 100).toFixed(2))
  }

  return null
})

/**
 * High/low enfeoffment estimations (in percent)
 */
const enfeoffmentEstimate = computed(() => {
  // Invalid, data missing
  if(!mortgage.value) {
    return {
      low: null,
      high: null
    }
  }
  const low = valueEstimate.value?.low ? parseFloat((mortgage.value/valueEstimate.value.low * 100).toFixed(2)) : null
  const high = valueEstimate.value?.high ? parseFloat((mortgage.value/valueEstimate.value.high * 100).toFixed(2)) : null


  // Return as array (low & high estimate)
  return {
    low,
    high,
  }

})

/**
 * Computed dossier object for PDF preview
 * Note that this is NOT identical to the data passed to the actual dossier creation function,
 * since we need to mock the entire dossier structure for the preview to work
 */
const dossierObject = computed(() => {

  const formData = form.values.value as Record<string, Record<string,unknown>>

  // Page 1
  const firstName = formData.full_name?.firstName
  const lastName = formData.full_name?.lastName
  const address =  formData.address
  const email = formData.email
  const phone = formData.phone_number
  const birthdate = formData.date_of_birth

  // Page 2
  const bankName =  (formData.bank as Record<string, string>).name as string|null
  const bankAbbreviation =  (formData.bank as Record<string, string>).abbreviation as string|null
  const propertyType = formData.property_type?.value
  const ownerOccupied = formData.owner_occupied
  const purchaseDate = formData.date_of_purchase
  const purchasePrice = formData.enfeoffment?.price
  const marketValueEstimation = formData.enfeoffment?.marketValueEstimation
  const mortgageAmount = formData.enfeoffment?.currentValueOfMortgage

  // Page 3
  const hasAmortisation = formData.amortisation?.hasAmortisation
  const directAmortisation = formData.amortisation?.directAmortisation         // may be null
  const amortisationAmount = formData.amortisation?.amortisationAmount         // may be null
  const hasBuildingLease = formData.building_lease?.hasBuildingLease
  const publicLandlord = formData.building_lease?.publicLandlord               // may be null
  const buildingLeaseExpirationDate = formData.building_lease?.expirationDate  // may be null
  const buildingLeaseInterest = formData.building_lease?.interest              // may be null
  const hasRenovation = formData.renovation?.hasRenovation
  const renovationPrice = formData.renovation?.renovationPrice                 // may be null
  const renovationYear = formData.renovation?.renovationYear                   // may be null

  // Mortgage partitions
  const mortgagePartitions = formData.mortgage as unknown as Record<string, number|Date>[]
  const partitionAmounts: number[] = []
  const partitionDates: Date[] = []
  mortgagePartitions.forEach((partition: Record<string, number|Date>) => {
    partitionAmounts.push(partition.amount as number)
    partitionDates.push(partition.date as Date)
  })

  // Page 4
  const incomes = formData.income
  const childAllowances = formData.child_allowances
  const bonus = formData.bonus
  const assets = formData.assets
  const leasing = formData.leasing
  const credit = formData.credit
  const alimony = formData.alimony
  const various = formData.various
  const prosecutions = formData.prosecutions
  const lossCertificates = formData.loss_certificates

  // Verify all mandatory attributes are present
  if([
    firstName, lastName, address, email, phone, birthdate,
    bankName, bankAbbreviation, propertyType, ownerOccupied, purchaseDate, purchasePrice, marketValueEstimation,
    mortgageAmount, hasAmortisation, hasBuildingLease, hasRenovation, mortgagePartitions,
    incomes, childAllowances, bonus, assets, leasing, credit, alimony, various, lossCertificates, prosecutions,
    affordability.value, eligibleIncome.value, totalCosts.value, valueEstimate.value, enfeoffmentEstimate.value
  ].some((value) => value === null || value === undefined)){
    return null
  }

  return {
      created_at: new Date(),
      // Basic information
      first_name: firstName,
      last_name: lastName,
      address,
      email,
      phone,
      birthdate,

      // Value purchase information
      original_bank: {
        name: bankName,
        abbreviation: bankAbbreviation
      },
      property_type: propertyType,
      owner_occupied: ownerOccupied,
      purchase_date: purchaseDate,
      purchase_price: parseInt(purchasePrice as string),
      market_value_estimation: parseInt(marketValueEstimation as string),
      mortgage_amount: parseInt(mortgageAmount as string),

      // Amortisation information
      has_amortisation: hasAmortisation,
      direct_amortisation: directAmortisation,
      amortisation_amount: parseInt(amortisationAmount as string),

      // Building lease information
      has_building_lease: hasBuildingLease,
      public_landlord: publicLandlord,
      building_lease_expiration_date: buildingLeaseExpirationDate,
      building_lease_interest: parseInt(buildingLeaseInterest as string),

      // Renovation information
      has_renovation: hasRenovation,
      renovation_year: renovationYear,
      renovation_price: parseInt(renovationPrice as string),

      // Mortgage partitions
      partition_amounts: partitionAmounts,
      partition_dates: partitionDates,

      // Income/cost information
      incomes,
      child_allowances: parseInt(childAllowances.toString()),
      bonus: parseInt(bonus.toString()),
      assets: parseInt(assets.toString()),
      leasing: parseInt(leasing.toString()),
      credit: parseInt(credit.toString()),
      alimony: parseInt(alimony.toString()),
      various: parseInt(various.toString()),
      prosecutions,
      loss_certificates: lossCertificates,

      // Flag for dossier being non-arrangeable
      non_arrangeable: nonArrangeable.value,

      // Calculated totals
      affordability: affordability.value,
      eligible_income: eligibleIncome.value,
      total_costs: totalCosts.value,
      value_estimate_low: valueEstimate.value?.low,
      value_estimate_high: valueEstimate.value?.high,
      enfeoffment_estimate_low: enfeoffmentEstimate.value.low,
      enfeoffment_estimate_high: enfeoffmentEstimate.value.high,
  }
})

// Upon mounting, get list of banks
onMounted(async () => {
  // Execute queries for existing & suggested banks
  const banksQuery = await executeQuery(ALL_BANK_NAMES)
  let bankList = banksQuery.data.getBankList as Record<string, string>[]
  const bankSuggestionsQuery = await executeQuery(BANK_NAME_SUGGESTIONS)
  const bankSuggestionsList = bankSuggestionsQuery.data.getBankNameSuggestions as Record<string, string>[]

  // Concatenate both arrays
  bankList = bankList.concat(bankSuggestionsList)

  // Format so option group can use it
  bankOptions.value = bankList.map((bank: Record<string, string>) => {
    return {
      label: bank.name,
      value: bank
    }
  }) as Record<string, unknown>[]
})

/**
 * Upon page change, validate whether warning dialogs must be shown
 * @returns {Promise<void>} - done
 */
async function onPageChange(){
  // When going to summary page, validate affordability
  if(form.step.value === form.pages.value.length - 1){
    await calculateValueEstimate();

    let affordabilityWarning
    let enfeoffmentWarning

    // Trigger warning depending on affordability rating
    if(affordability.value && affordability.value > 35){
      affordabilityWarning = i18n.global.t('warnings.affordability_impossible')
    } else if(affordability.value && affordability.value > 33 && affordability.value <= 35){
      affordabilityWarning = i18n.global.t('warnings.affordability_critical')
    }

    // Trigger warning depending on enfeoffment ratio (if >80%), use low value because its enfeoffment is higher
    if(enfeoffmentEstimate.value && enfeoffmentEstimate.value.low && enfeoffmentEstimate.value.low > 80){
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
    }

    // Enfeoffment warning
    if(enfeoffmentWarning){
      $q.dialog({
        component: WarningDialog,
        componentProps: {
          description: enfeoffmentWarning
        }
      })
    }

    // Set warnings if needed (for some reason, ESLint can't handle this)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setWarning(DOSSIER_WARNING.ENFEOFFMENT, !!enfeoffmentWarning)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    setWarning(DOSSIER_WARNING.AFFORDABILITY, !!affordabilityWarning)
  }
}

/**
 * Calculates the High/low market value estimations (based on value gain and customer estimate)
 * @returns {Promise<void>} - done
 */
async function calculateValueEstimate(){
  // Get form data
  const formData = form.values.value as Record<string, Record<string,unknown>>

  // Ensure all necessary data is present
  const address =  formData.address
  const purchaseDate = formData.date_of_purchase as unknown as Date
  const customerEstimate = form.values.value.enfeoffment ? Math.round((form.values.value.enfeoffment as Record<string, number>)?.marketValueEstimation) : null
  const priceAtPurchase = form.values.value.enfeoffment ? Math.round((form.values.value.enfeoffment as Record<string, number>)?.price) : null

  if(!address || !purchaseDate || !priceAtPurchase ||!customerEstimate){
    $errorService?.showErrorDialog(new Error(i18n.global.t('errors.missing_data')))
    return;
  }

  const zipCode = address.zip_code as string
  const startDateString = dateToInputString(purchaseDate)
  const endDateString = dateToInputString(new Date())

  // Ensure user has token
  const token: string|null = getAuthToken();

  if(!token){
    $errorService?.showErrorDialog(new Error(i18n.global.t('errors.error_occurred')))
    return;
  }

  // Set loading status
  valueEstimateLoading.value = true

  const headers = {
    Authorization: `Bearer ${token}`
  }
  const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL ??  ''
  const url = `${baseUrl}/getValueDevelopment?zipCode=${zipCode}&start=${startDateString}&end=${endDateString}`
  await $authService?.refreshToken()

  // Get value multiplier from backend
  await axios.get(url, {headers}).then((multiplierRequest) => {
    const multiplier = multiplierRequest?.data as number;


    if(!multiplier){
      $errorService?.showErrorDialog(new Error(i18n.global.t('errors.error_occurred')))
      return;
    }

    const highEstimate = Math.round(priceAtPurchase * multiplier)

    // Return as array (low & high estimate)
    valueEstimate.value = {
      low: customerEstimate,
      high: highEstimate
    }

    // Set loading status
    valueEstimateLoading.value = false
  }).catch(()=>{
    // Return as array (low & high estimate)
    valueEstimate.value = {
      low: customerEstimate,
      high: customerEstimate
    }
    prognosisAvailable.value = false
    valueEstimateLoading.value = false
  });

}


/**
 * Sets a warning to the given value
 * @param {DOSSIER_WARNING} warning - the warning
 * @param {boolean} value - the value to set it to
 * @returns {void}
 */
function setWarning(warning: DOSSIER_WARNING, value: boolean){
  if(value){
    if(!warnings.value.includes(warning)){
      warnings.value.push(warning)
    }
  } else if(warnings.value.includes(warning)){
    warnings.value.splice(warnings.value.indexOf(warning), 1)
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
async function onSubmit() {
  if(hasSubmitted.value){
    return
  }

  // Prevent multi-submit
  hasSubmitted.value = true

  const formData = form.values.value as Record<string, Record<string,unknown>>

  // Page 1
  const firstName = formData.full_name?.firstName
  const lastName = formData.full_name?.lastName
  const address =  formData.address
  const email = formData.email
  const phone = formData.phone_number
  const birthdate = formData.date_of_birth

  // Page 2
  const bankName =  (formData.bank as Record<string, string>).name as string|null
  const bankAbbreviation =  (formData.bank as Record<string, string>).abbreviation as string|null
  const propertyType = formData.property_type?.value
  const ownerOccupied = formData.owner_occupied
  const purchaseDate = formData.date_of_purchase
  const purchasePrice = formData.enfeoffment?.price
  const marketValueEstimation = formData.enfeoffment?.marketValueEstimation
  const mortgageAmount = formData.enfeoffment?.currentValueOfMortgage

  // Page 3
  const hasAmortisation = formData.amortisation?.hasAmortisation
  const directAmortisation = formData.amortisation?.directAmortisation         // may be null
  const amortisationAmount = formData.amortisation?.amortisationAmount         // may be null
  const hasBuildingLease = formData.building_lease?.hasBuildingLease
  const publicLandlord = formData.building_lease?.publicLandlord               // may be null
  const buildingLeaseExpirationDate = formData.building_lease?.expirationDate  // may be null
  const buildingLeaseInterest = formData.building_lease?.interest              // may be null
  const hasRenovation = formData.renovation?.hasRenovation
  const renovationPrice = formData.renovation?.renovationPrice                 // may be null
  const renovationYear = formData.renovation?.renovationYear                   // may be null

  // Mortgage partitions
  const mortgagePartitions = formData.mortgage as unknown as Record<string, number|Date>[]
  const partitionAmounts: number[] = []
  const partitionDates: Date[] = []
  mortgagePartitions.forEach((partition: Record<string, number|Date>) => {
    partitionAmounts.push(partition.amount as number)
    partitionDates.push(partition.date as Date)
  })

  // Page 4
  const incomes = formData.income
  const childAllowances = formData.child_allowances
  const bonus = formData.bonus
  const assets = formData.assets
  const leasing = formData.leasing
  const credit = formData.credit
  const alimony = formData.alimony
  const various = formData.various
  const prosecutions = formData.prosecutions
  const lossCertificates = formData.loss_certificates

  // Verify all mandatory attributes are present
  if([
    firstName, lastName, address, email, phone, birthdate,
    bankName, bankAbbreviation, propertyType, ownerOccupied, purchaseDate, purchasePrice, marketValueEstimation,
    mortgageAmount, hasAmortisation, hasBuildingLease, hasRenovation, mortgagePartitions,
    incomes, childAllowances, bonus, assets, leasing, credit, alimony, various, lossCertificates, prosecutions,
    affordability.value, eligibleIncome.value, totalCosts.value, valueEstimate.value, enfeoffmentEstimate.value
  ].some((value) => value === null || value === undefined)){
    // Show error
    $errorService?.showErrorDialog(
      new Error(i18n.global.t('errors.dossier_submit_error'))
    )
    return
  }

  // Creates a dossier
  try{
    const mutationResult = await executeMutation(CREATE_DOSSIER, {
    createDossierInput: {
      // Basic information
      first_name: firstName,
      last_name: lastName,
      address,
      email,
      phone,
      birthdate,

      // Value purchase information
      original_bank_name: bankName,
      original_bank_abbreviation: bankAbbreviation,
      property_type: propertyType,
      owner_occupied: ownerOccupied,
      purchase_date: purchaseDate,
      purchase_price: parseInt(purchasePrice as string),
      market_value_estimation: parseInt(marketValueEstimation as string),
      mortgage_amount: parseInt(mortgageAmount as string),

      // Amortisation information
      has_amortisation: hasAmortisation,
      direct_amortisation: directAmortisation,
      amortisation_amount: parseInt(amortisationAmount as string),

      // Building lease information
      has_building_lease: hasBuildingLease,
      public_landlord: publicLandlord,
      building_lease_expiration_date: buildingLeaseExpirationDate,
      building_lease_interest: parseInt(buildingLeaseInterest as string),

      // Renovation information
      has_renovation: hasRenovation,
      renovation_year: renovationYear,
      renovation_price: parseInt(renovationPrice as string),

      // Mortgage partitions
      partition_amounts: partitionAmounts,
      partition_dates: partitionDates,

      // Income/cost information
      incomes,
      child_allowances: parseInt(childAllowances.toString()),
      bonus: parseInt(bonus.toString()),
      assets: parseInt(assets.toString()),
      leasing: parseInt(leasing.toString()),
      credit: parseInt(credit.toString()),
      alimony: parseInt(alimony.toString()),
      various: parseInt(various.toString()),
      prosecutions,
      loss_certificates: lossCertificates,

      // Flag for dossier being non-arrangeable
      non_arrangeable: nonArrangeable.value,

      // Calculated totals
      affordability: affordability.value,
      eligible_income: eligibleIncome.value,
      total_costs: totalCosts.value,
      value_estimate_low: valueEstimate.value?.low,
      value_estimate_high: valueEstimate.value?.high,
      enfeoffment_estimate_low: enfeoffmentEstimate.value.low,
      enfeoffment_estimate_high: enfeoffmentEstimate.value.high,
    }
  })

    const newDossier = mutationResult?.data?.createDossier as Record<string, unknown>|null

    if(!newDossier){
      // Show error
      $errorService?.showErrorDialog(
        new Error(i18n.global.t('errors.dossier_upload_error'))
      )
      return;
    }

    // Route to final document
    await $routerService?.routeTo(ROUTES.DOSSIER_FINAL_DOCUMENT, {did: newDossier.uuid})
  } catch(err){
    // Show error
    $errorService?.showErrorDialog(
      new Error(i18n.global.t('errors.dossier_upload_error', {error: (err as Error).message}))
    )
    return
  }

}

/**
 * Gets the rank for a given enfeoffment rate
 * @param {number} rate - enfeoffment rate in percent
 * @returns {string} - rank string
 */
function enfeoffmentRank(rate: number){
  if(rate <= 66){
    return i18n.global.t('form_for_clients.enfeoffment_first_rank')
  } else if(rate > 66 && rate <= 80){
    return i18n.global.t('form_for_clients.enfeoffment_second_rank')
  }
  return i18n.global.t('form_for_clients.enfeoffment_too_high')
}
</script>
