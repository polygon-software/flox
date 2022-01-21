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
                <!-- NOTE: Because of the bank list, we separately pass 'options' prop -->
                <!-- NOTE: these are only done in the LHS section since these fields are LHS! -->
                <component
                  :is="field.component"
                  v-for="field in leftSection.fields"
                  :key="field.key"
                  v-bind="field.attributes"
                  v-model="form.values.value[field.key]"
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
import {ErrorService} from 'src/services/ErrorService';
import {ALL_BANK_NAMES} from 'src/data/queries/BANK';
import {DOSSIER_WARNING} from '../../../../shared/definitions/ENUMS';

const $routerService: RouterService | undefined = inject('$routerService')
const $errorService: ErrorService|undefined = inject('$errorService')
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

// Triggered warnings (used for computing non-arrangeable status)
const warnings: Ref<DOSSIER_WARNING[]> = ref([])

// Non-arrangeable tag: if any warnings present, mark as non-arrangeable
const nonArrangeable = computed(() => {
  return warnings.value.length > 0
})

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
      label: `${bank.name} (${bank.abbreviation})`,
      value: bank
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
  const formData = form.values.value as Record<string, Record<string,unknown>>
  console.log('form data:', formData)

  // Page 1
  const firstName = formData.full_name?.firstName
  const lastName = formData.full_name?.lastName
  const address =  formData.address
  const email = formData.email
  const phone = formData.phone_number
  const birthdate = formData.date_of_birth

  // Page 2
  const bankName =  formData.bank?.value.name as string|null
  const bankAbbreviation =  formData.bank?.value.abbreviation as string|null
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
  const mortgagePartitions = formData.mortgage
  const partitionAmounts = []
  const partitionDates = []
  mortgagePartitions.forEach((partition: Record<string, number|Date>) => {
    partitionAmounts.push(partition.amount)
    partitionDates.push(partition.date)
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
      purchase_price: parseInt(purchasePrice),
      market_value_estimation: parseInt(marketValueEstimation),
      mortgage_amount: parseInt(mortgageAmount),

      // Amortisation information
      has_amortisation: hasAmortisation,
      direct_amortisation: directAmortisation,
      amortisation_amount: parseInt(amortisationAmount),

      // Building lease information
      has_building_lease: hasBuildingLease,
      public_landlord: publicLandlord,
      building_lease_expiration_date: buildingLeaseExpirationDate,
      building_lease_interest: parseInt(buildingLeaseInterest),

      // Renovation information
      has_renovation: hasRenovation,
      renovation_year: renovationYear,
      renovation_price: parseInt(renovationPrice),

      // Mortgage partitions
      partition_amounts: partitionAmounts,
      partition_dates: partitionDates,

      // Income/cost information
      incomes,
      child_allowances: parseInt(childAllowances),
      bonus: parseInt(bonus),
      assets: parseInt(assets),
      leasing: parseInt(leasing),
      credit: parseInt(credit),
      alimony: parseInt(alimony),
      various: parseInt(various),
      prosecutions,
      loss_certificates: lossCertificates,

      // Flag for dossier being non-arrangeable
      non_arrangeable: nonArrangeable.value,

      // Calculated totals
      affordability: parseFloat(affordability.value),
      eligible_income: parseInt(eligibleIncome.value),
      total_costs: parseInt(totalCosts.value),
      value_estimate_low: parseInt(valueEstimate.value.low),
      value_estimate_high: parseInt(valueEstimate.value.high),
      enfeoffment_estimate_low: parseFloat(enfeoffmentEstimate.value.low),
      enfeoffment_estimate_high: parseFloat(enfeoffmentEstimate.value.high)
    }
  })

    const newDossier = mutationResult.data?.createDossier as Record<string, unknown>|null

    if(!newDossier){
      // Show error
      $errorService?.showErrorDialog(
        new Error(i18n.global.t('errors.dossier_upload_error', {error: (err as Error).message}))
      )
    }

    // Route to final document
    await $routerService?.routeTo(ROUTES.DOSSIER_FINAL_DOCUMENT, {did: newDossier.uuid})
  } catch(err: Error){
    // Show error
    $errorService?.showErrorDialog(
      new Error(i18n.global.t('errors.dossier_upload_error', {error: (err as Error).message}))
    )
  }

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
