<template>
  <q-page class="flex justify-start q-pa-none q-ma-none">
    <q-form
      greedy
      style="width: calc(100% - 32px)"
      @submit="onSubmit"
    >
      <!-- General Info -->
      <q-card
        class="q-ma-md"
        flat
        style="width: 100%; border-radius: 20px; border: 1px solid black"
      >
        <h6 class="q-ma-md">{{ $t('products.general') }}</h6>

        <!-- Input fields -->
        <div class="row">
          <!-- Left column -->
          <div class="col-6 q-pa-md">
            <div class="row flex justify-between">
              <!-- Name -->
              <q-input
                v-model="input.title"
                class="q-ma-sm full-width"
                :label="$t('products.product_name')"
                outlined
                dense
                lazy-rules
                :rules="[ (val) => IS_VALID_STRING(val) || $t('errors.invalid_input')]"
              />

              <!-- Description -->
              <q-input
                v-model="input.description"
                class="q-ma-sm full-width"
                :label="$t('products.product_description')"
                outlined
                dense
                type="textarea"
              />

            </div>
          </div>
          <!-- Right column -->
          <div class="col-6 q-pa-md">

            <!-- Brand & category row -->
            <div class="row flex justify-between">
              <q-input
                v-model="input.brand"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.brand')"
                outlined
                dense
              />
              <q-select
                v-model="input.category"
                :options="categories"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.category')"
                outlined
                dense
              />
            </div>

            <!-- Start and End Date TODO Create custom date-time pickerTODO Create custom date-time picker -->
            <div class="row flex justify-between">
              <!-- Start date -->
              <q-input
                v-model="input.start"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.start')"
                stack-label
                type="date"
                outlined
                dense
                lazy-rules
                :rules="[ (val) => (val === null || IS_FUTURE_DATE(val)) || $t('errors.date_must_be_future')]"
              />

              <!-- End date -->
              <!-- TODO ensure date is at least some time (24h?) after start -->
              <q-input
                v-model="input.end"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.end')"
                stack-label
                type="date"
                outlined
                dense
                lazy-rules
                :rules="[ (val) => (val === null || IS_FUTURE_DATE(val)) || $t('errors.date_must_be_future')]"
              />
            </div>

            <!-- Value & currency -->
            <div class="row flex justify-between">
              <q-input
                v-model="input.value"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.value')"
                type="number"
                outlined
                dense
                lazy-rules
                :rules="[ (val) => (val === null || val === '' || IS_VALID_NUMBER(val)) || $t('errors.invalid_number')]"
              />
              <q-select
                v-model="input.currency"
                :options="currencies"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.currency')"
                outlined
                dense
              />
            </div>

            <!-- Min/Max bet -->
            <div class="row flex justify-between">
              <q-input
                v-model="input.minBet"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.min_bet')"
                type="number"
                outlined
                dense
                lazy-rules="ondemand"
                :rules="[ (val) => (val === null || val === '' || IS_VALID_MIN_BET(val, input.maxBet, input.value)) || $t('errors.invalid_number')]"
              />

              <q-input
                v-model="input.maxBet"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.max_bet')"
                type="number"
                outlined
                dense
                lazy-rules="ondemand"
                :rules="[ (val) => (val === null || val === '' || IS_VALID_MAX_BET(val, input.minBet, input.value)) || $t('errors.invalid_number')]"
              />
            </div>
          </div>
        </div>

      </q-card>

      <!-- Tags. TODO -->
      <div class="row full-width flex justify-between">

        <!-- Tags -->
        <q-card
          class="q-pa-md q-ma-md"
          flat
          style="border-radius: 20px; border: 1px solid black; width: calc(50% - 50px)"
        >
          <h6 class="q-ma-md">{{ $t('products.tags') }}</h6>
          <q-select
            ref="ChipInput"
            v-model="input.tags"
            class="q-ma-md"
            outlined
            multiple
            use-chips
            use-input
            new-value-mode="add"
            stack-label
            dense
            hide-dropdown-icon
            :label="$t('products.tags')"
            :hint="$t('products.tags_hint')"
          />
        </q-card>

        <!-- Product Type -->
        <q-card
          class="q-pa-md q-ma-md"
          flat
          style="border-radius: 20px; border: 1px solid black; width: calc(50% - 50px)"
        >
          <h6 class="q-ma-md">{{ $t('products.type') }}</h6>
          <div class="row flex justify-between items-center q-ma-md">
            <!-- Sponsored -->
            <q-select
              v-model="input.sponsored"
              :options="sponsored"
              map-options
              emit-value
              class="column"
              style="width: calc(50% - 25px)"
              :label="$t('products.promotion')"
              outlined
              dense
            />
          </div>
        </q-card>
      </div>

      <!-- Promotion -->
      <div class="row full-width">
        <q-card
          class="q-pa-md q-ma-md"
          flat
          style="width: 100%; border-radius: 20px; border: 1px solid black"
        >
          <h6 class="q-ma-md">{{ $t('products.promotion') }}</h6>

          <!-- Product Page -->
          <div class="row flex justify-between">
            <!-- Product Page Link -->
            <q-input
              v-model="input.directBuyLink"
              class="q-ma-sm col-7"
              :label="$t('products.product_page_link')"
              outlined
              dense
              type="url"
              :rules="[ (val) => !val || val === '' || IS_URL(val)]"
            />
            <q-input
              v-model="input.directBuyLinkMaxClicks"
              class="q-ma-sm col-2"
              :label="$t('products.max_clicks')"
              type="number"
              outlined
              dense
              :rules="[ (val) => !val || val === ''|| val === 0 || IS_LARGER_THAN(val, 0)]"
            />
            <q-input
              v-model="input.directBuyLinkMaxCost"
              class="q-ma-sm col-2"
              :label="$t('products.max_cost')"
              type="number"
              outlined
              dense
              :rules="[ (val) => !val || val === '' || val === 0 || IS_LARGER_THAN(val, 0)]"
            />
          </div>

          <!-- Seller Page -->
          <div class="row flex justify-between">
            <!-- Seller Page Link -->
            <q-input
              v-model="input.brandLink"
              class="q-ma-sm col-7"
              :label="$t('products.seller_page_link')"
              outlined
              dense
              type="url"
              :rules="[ (val) => !val || val === '' || IS_URL(val)]"
            />
            <q-input
              v-model="input.brandLinkMaxClicks"
              class="q-ma-sm col-2"
              :label="$t('products.max_clicks')"
              type="number"
              outlined
              dense
              :rules="[ (val) => !val || val === '' || val === 0 || IS_LARGER_THAN(val, 0)]"
            />
            <q-input
              v-model="input.brandLinkMaxCost"
              class="q-ma-sm col-2"
              :label="$t('products.max_cost')"
              type="number"
              outlined
              dense
              :rules="[ (val) => !val || val === '' || val === 0 || IS_LARGER_THAN(val, 0)]"
            />
          </div>
        </q-card>
      </div>

      <!-- Images TODO Show already uploaded images-->
      <div class="row full-width">
        <q-card
          class="q-pa-md q-ma-md"
          flat
          style="width: 100%; border-radius: 20px; border: 1px solid black"
        >
          <h6 class="q-ma-md">{{ $tc('products.image', 2) }}</h6>
          <!-- TODO -->
          <PictureUpload
            :pictures="pictures"
            @change="onPictureChange"
          />
        </q-card>
      </div>

      <!-- Submit -->
      <div class="row">
        <q-btn
          class="q-ma-md text-black"
          color="primary"
          :label="status === PRODUCT_STATUS.VALID ? $t('buttons.submit') : $t('buttons.save_draft')"
          type="submit"
          rounded
          no-caps
          style="height: 50px;"
        />
      </div>

    </q-form>
  </q-page>
</template>

<script setup lang="ts">
/**
 * A page for uploading products. Can be used to either create new products or existing ones, controlled via props
 */
import {computed, ComputedRef, inject, reactive, Ref, ref, watch} from 'vue';
import PictureUpload from 'components/forms/fields/PictureUpload.vue';
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import {CREATE_PRODUCT, UPDATE_PRODUCT} from 'src/data/mutations/PRODUCT';
import {i18n} from 'boot/i18n';
import {CATEGORY, CURRENCY, PRODUCT_STATUS} from '../../../shared/definitions/ENUM'
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {useRoute} from 'vue-router';
import axios, { AxiosResponse } from 'axios'
import {PRODUCT} from 'src/data/queries/QUERIES';
import {
  IS_FUTURE_DATE,
  IS_LARGER_THAN,
  IS_URL,
  IS_VALID_MAX_BET,
  IS_VALID_MIN_BET,
  IS_VALID_NUMBER,
  IS_VALID_STRING
} from 'src/data/RULES';
import {sleep} from 'src/helpers/general-helpers';
import {toBase64} from 'src/helpers/image-helper';
import {QueryObject} from 'src/data/DATA-DEFINITIONS';

const $routerService: RouterService|undefined = inject('$routerService')
const route = useRoute()

const productId = route.query.id
const queryResult = productId ? subscribeToQuery(PRODUCT as QueryObject, {uuid: productId}) as Ref<Record<string, unknown>> : ref(null)


// Read ENUM values and so they can be used as options
const categories = Object.values(CATEGORY).filter((item) => {
  return isNaN(Number(item))
})

const currencies: CURRENCY[] = Object.values(CURRENCY).filter((item) => {
  return isNaN(Number(item))
})

const sponsored = [{value: true, label: i18n.global.t('general.yes')}, {value: false, label: i18n.global.t('general.no')}]

// Check if all required fields have been filled. If yes, set the product status to valid
const status: ComputedRef<PRODUCT_STATUS> = computed(() => {
  if ([input.title,
    input.description,
    input.brand,
    input.value,
    input.currency,
    input.start,
    input.end,
    input.category,
    input.minBet,
    input.maxBet,
    input.sponsored].some((value) => {return value === null || value === undefined || (typeof value === 'string' && value === '')})) {
    return PRODUCT_STATUS.DRAFT as PRODUCT_STATUS
  }
  return PRODUCT_STATUS.VALID as PRODUCT_STATUS
})

// Inputs for CREATE_PRODUCT mutation // TODO define Joi type
const input: Record<string, unknown> = reactive(
  {
  title: null,
  description: null,
  brand: null,
  value: null,
  currency: currencies[0],
  start: null,
  end: null,
  category: null,
  minBet: null,
  maxBet: null,
  tags: null,
  status: status,
  sponsored: null,
  brandLink: null,
  brandLinkMaxClicks: null,
  brandLinkMaxCost: null,
  directBuyLink: null,
  directBuyLinkMaxClicks: null,
  directBuyLinkMaxCost: null,
})

// Picture inputs (separated from input, since these have to be added after product is created)
const pictures: Ref<Array<Ref<File>>> = ref([])
const oldPictures: Ref<Array<string|ArrayBuffer|null>> = ref([])

/**
 * Watch for first result if a product is given
 */
const stop = watch(queryResult, async (newValue) => {
  if(newValue && newValue !== {} && !(Array.isArray(newValue) && newValue.length === 0)){
    // Wait for 100ms before prefilling form to avoid hydration mismatches & UI bugs in fields
    await sleep(100)

    mapValuesToInput(newValue)

    // Pictures
    pictures.value = await mapPicturesToInput(newValue)
    // TODO handle pictures... @Marino: When making pictures an object, consider taking the format of this.
    // TODO but we also have to adapt upload to only add those pictures that were not yet added (and allow deletion of old ones)

    // Stop watcher, since we already got initial values
    stop()
  }
})

/**
 * Maps the data fetched from the DB to the input object.
 * @param {Record<string, unknown>} newValue Data object loaded from DB
 * @return {void}
 */
function mapValuesToInput(newValue: Record<string, string|unknown>): void {
  // Manually handle each field, since some fields are special
  input.title = newValue.title
  input.description = newValue.description
  input.brand = newValue.brand
  input.category = newValue.category
  input.value = newValue.value !== '' ? newValue.value : null
  input.currency = newValue.currency
  input.minBet = newValue.minBet !== '' ? newValue.minBet : null
  input.maxBet = newValue.maxBet !== '' ? newValue.maxBet : null
  input.sponsored = newValue.sponsored
  input.tags = newValue.tags
  input.directBuyLink = newValue.directBuyLink !== '' ? newValue.directBuyLink : null
  input.directBuyLinkMaxClicks = newValue.directBuyLinkMaxClicks !== '' ? newValue.directBuyLinkMaxClicks : null
  input.directBuyLinkMaxCost = newValue.directBuyLinkMaxCost !== '' ? newValue.directBuyLinkMaxCost : null
  input.brandLink = newValue.brandLink !== '' ? newValue.brandLink : null
  input.brandLinkMaxClicks = newValue.brandLinkMaxClicks !== '' ? newValue.brandLinkMaxClicks : null
  input.brandLinkMaxCost = newValue.brandLinkMaxCost !== '' ? newValue.brandLinkMaxCost : null

  // Dates: extract substring for date-only
  input.start = newValue.start ? (newValue.start as string).substring(0, 10) : null
  input.end = newValue.end ? (newValue.end as string).substring(0, 10) : null
}

/**
 * Maps the pictures fetched from the DB to the input object.
 * @param {Record<string, unknown>} newValue Data object loaded from DB
 * @async
 * @return {Promise<Array<Ref<File>>>} Pictures loaded from DB as data urls
 */
async function mapPicturesToInput(newValue: Record<string, unknown>): Promise<Array<Ref<File>>> {
  const existingPictures: Array<Ref<File>> = []
  const newPictures = newValue.pictures as Record<string, string>[]
  for (const picture of newPictures) {
    const index: number = newPictures.indexOf(picture);
    await axios.get(
      picture.url,
      {
        responseType: 'blob'
      }).then(async (res: AxiosResponse<Blob>) => {
      const file = new File([res.data], `${(input as Record<string, string>).title}_${index}`)
      existingPictures.push(ref(file))

      // This array is used to remember which pictures currently exist
      const b64Picture = await toBase64(file)
      if (!oldPictures.value.includes(b64Picture)) {
        oldPictures.value.push(b64Picture)
      }
    });
  }
  return existingPictures
}

/**
 * On picture change, overwrites the array
 * @param {Ref<File[]>} newPictures - New pictures
 * @returns {void}
 */
function onPictureChange(newPictures: Ref<File>[]){
  pictures.value = newPictures
}

/**
 * TODO cleanup, simplify
 * On submit, creates/updates existing product
 * @returns {void}
 */
async function onSubmit(){
  // Parameters for creating/updating
  const base64Pictures: Array<string|ArrayBuffer|null> = []
  for (const picture of pictures.value) {
    if (picture.value) {
      const base64String = await toBase64(picture.value)
      base64Pictures.push(base64String)
    }
  }

  const params = {
    ...input,
    value: Number.parseInt(input.value as string ?? ''), // Convert 'value' to int TODO can this be done on QInput directly?
    minBet: Number.parseInt(input.minBet as string ?? ''),
    maxBet: Number.parseInt(input.maxBet as string ?? ''),
    directBuyLinkMaxClicks: Number.parseInt(input.directBuyLinkMaxClicks as string ?? ''),
    directBuyLinkMaxCost: Number.parseInt(input.directBuyLinkMaxCost as string ?? ''),
    brandLinkMaxClicks: Number.parseInt(input.brandLinkMaxClicks as string ?? ''),
    brandLinkMaxCost: Number.parseInt(input.brandLinkMaxCost as string ?? ''),
  }

    let mutationResult

    if(productId){
      // Case 1: EDIT
      mutationResult = await executeMutation(
        UPDATE_PRODUCT,
        {
          updateProductInput: {
            uuid: productId,
            ...params,
          },
          pictures: compareArrays(base64Pictures, oldPictures.value) ? null : base64Pictures,
        }
      )
    } else {
      // Case 2: CREATE
      mutationResult = await executeMutation(
        CREATE_PRODUCT,
        {
          createProductInput: params,
          pictures: base64Pictures
        }
      )
    }

    if(!mutationResult){
      throw new Error('Product creation/update failed')
    }

  // Push to success page
  await $routerService?.routeTo(ROUTES.MY_PRODUCTS)
}

/**
 * Compares two arrays containing pictures as b64 strings an returns if they are the same of not.
 * @param {Array<Promise<string>>} array1 First array
 * @param {Array<Promise<string>>} array2 Second array
 * @return {boolean} True if arrays are the same
 */
function compareArrays(array1: Array<string|ArrayBuffer|null>, array2: Array<string|ArrayBuffer|null>): boolean {
  if (array1.length === array2.length) {
    for (let i=0; i<array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false
      }
    }
    return true
  }
  return false
}
</script>
