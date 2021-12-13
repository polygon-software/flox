<template>
  <q-page class="flex justify-start q-pa-none q-ma-none">
    <q-form
      greedy
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
                :rules="[ (val) => IS_FUTURE_DATE(val) || $t('errors.date_must_be_future')]"
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
                :rules="[ (val) => IS_FUTURE_DATE(val) || $t('errors.date_must_be_future')]"
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
                :rules="[ (val) => IS_VALID_NUMBER(val) || $t('errors.invalid_number')]"
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
                :rules="[ (val) => IS_VALID_MIN_BET(val, input.maxBet, input.value) || $t('errors.invalid_number')]"
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
                :rules="[ (val) => IS_VALID_MAX_BET(val, input.minBet, input.value) || $t('errors.invalid_number')]"
              />
            </div>
          </div>
        </div>

      </q-card>

      <!-- Tags and Status. TODO -->
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

        <!-- Product Status -->
        <q-card
          class="q-pa-md q-ma-md"
          flat
          style="border-radius: 20px; border: 1px solid black; width: calc(50% - 50px)"
        >
          <h6 class="q-ma-md">{{ $t('products.status') }}</h6>
          <div class="row flex justify-between items-center q-ma-md">

            <!-- Status -->
            <q-select
              v-model="input.status"
              :options="status"
              style="width: calc(50% - 25px)"
              :label="$t('products.status')"
              outlined
              dense
            />

            <!-- Sponsored -->
            <q-select
              v-model="input.sponsored"
              :options="sponsored"
              map-options
              emit-value
              class="column q-ma-sm"
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
              :rules="[ (val) => !val || IS_URL(val)]"
            />
            <q-input
              v-model="input.directBuyLinkMaxClicks"
              class="q-ma-sm col-2"
              :label="$t('products.max_clicks')"
              type="number"
              outlined
              dense
              :rules="[ (val) => !val || val === 0 || IS_LARGER_THAN(val, 0)]"
            />
            <q-input
              v-model="input.directBuyLinkMaxCost"
              class="q-ma-sm col-2"
              :label="$t('products.max_cost')"
              type="number"
              outlined
              dense
              :rules="[ (val) => !val || val === 0 || IS_LARGER_THAN(val, 0)]"
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
              :rules="[ (val) => !val || IS_URL(val)]"
            />
            <q-input
              v-model="input.brandLinkMaxClicks"
              class="q-ma-sm col-2"
              :label="$t('products.max_clicks')"
              type="number"
              outlined
              dense
              :rules="[ (val) => !val || val === 0 || IS_LARGER_THAN(val, 0)]"
            />
            <q-input
              v-model="input.brandLinkMaxCost"
              class="q-ma-sm col-2"
              :label="$t('products.max_cost')"
              type="number"
              outlined
              dense
              :rules="[ (val) => !val || val === 0 || IS_LARGER_THAN(val, 0)]"
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
            @change="onPictureChange"
          />
        </q-card>
      </div>

      <!-- Submit -->
      <div class="row">
        <q-btn
          class="q-ma-md text-black"
          color="primary"
          :label="$t('buttons.submit')"
          type="submit"
          style="width: 150px; height: 50px;"
        />
      </div>

    </q-form>
  </q-page>
</template>

<script setup lang="ts">
/**
 * A page for uploading products. Can be used to either create new products or existing ones, controlled via props
 */
import {inject, reactive, Ref, ref, watch} from 'vue';
import PictureUpload from 'components/forms/fields/PictureUpload.vue';
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import {CREATE_PRODUCT, UPDATE_PRODUCT} from 'src/data/mutations/PRODUCT';
import axios from 'axios';
import {i18n} from 'boot/i18n';
import {CATEGORY, CURRENCY, PRODUCT_STATUS, SELECTABLE_PRODUCT_STATUS} from '../../../shared/definitions/ENUM'
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {useRoute} from 'vue-router';
import {PRODUCT} from 'src/data/queries/QUERIES';
import {IS_VALID_STRING, IS_FUTURE_DATE, IS_VALID_MIN_BET, IS_VALID_MAX_BET, IS_VALID_NUMBER, IS_LARGER_THAN, IS_URL} from 'src/data/RULES';
import {sleep} from 'src/helpers/general-helpers';
const $routerService: RouterService|undefined = inject('$routerService')
const route = useRoute()

const productId = route.query.id
const queryResult = productId ? subscribeToQuery(PRODUCT, {uuid: productId}) as Ref<Record<string, unknown>> : ref(null)


// Read ENUM values and so they can be used as options
const categories = Object.values(CATEGORY).filter((item) => {
  return isNaN(Number(item))
})

const currencies = Object.values(CURRENCY).filter((item) => {
  return isNaN(Number(item))
})

const status = Object.values(SELECTABLE_PRODUCT_STATUS).filter((item) => {
  return isNaN(Number(item))
})

const sponsored = [{value: true, label: i18n.global.t('general.yes')}, {value: false, label: i18n.global.t('general.no')}]

// Inputs for CREATE_PRODUCT mutation // TODO define Joi type
const input: Record<string, unknown> = reactive(
  {
  title: null,
  description: null,
  brand: null,
  value: null,
  currency: null, // TODO Fetch last selected or depending on location?
  start: null,
  end: null,
  category: null,
  minBet: null,
  maxBet: null,
  tags: null,
  status: null,
  sponsored: null,
  brandLink: null,
  brandLinkMaxClicks: null,
  brandLinkMaxCost: null,
  directBuyLink: null,
  directBuyLinkMaxClicks: null,
  directBuyLinkMaxCost: null,
})

/**
 * Watch for first result if a product is given
 */
const stop = watch(queryResult, async (newValue) => {
  if(newValue && newValue !== {} && !(Array.isArray(newValue) && newValue.length === 0)){
    // Wait for 100ms before prefilling form to avoid hydration mismatches & UI bugs in fields
    await sleep(100)

    // Manually handle each field, since some fields are special
    input.title = newValue.title
    input.description = newValue.description
    input.brand = newValue.brand
    input.category = newValue.category
    input.value = newValue.value
    input.currency = newValue.currency
    input.minBet = newValue.minBet
    input.maxBet = newValue.maxBet
    input.status = PRODUCT_STATUS.DRAFT // TODO: do not allow user to set this manually
    input.sponsored = newValue.sponsored
    input.tags = newValue.tags
    input.directBuyLink = newValue.directBuyLink
    input.directBuyLinkMaxClicks = newValue.directBuyLinkMaxClicks
    input.directBuyLinkMaxCost = newValue.directBuyLinkMaxCost
    input.brandLink = newValue.brandLink
    input.brandLinkMaxClicks = newValue.brandLinkMaxClicks
    input.brandLinkMaxCost = newValue.brandLinkMaxCost

    // Dates: extract substring for date-only
    input.start = newValue.start ? (newValue.start as string).substring(0, 10) : null
    input.end = newValue.end ? (newValue.end as string).substring(0, 10) : null

    // TODO handle pictures... @Marino: When making pictures an object, consider taking the format of this.
    // TODO but we also have to adapt upload to only add those pictures that were not yet added (and allow deletion of old ones)

    // Stop watcher, since we already got initial values
    stop()
  }
})
// Picture inputs (separated from input, since these have to be added after product is created)
const pictures: Ref<Array<Ref<File>>> = ref([])

/**
 * On picture change, overwrites the array
 * @param {Ref<File[]>} newPictures - New pictures
 * @returns {void}
 */
function onPictureChange(newPictures: Ref<File>[]){
  pictures.value = newPictures
}

/**
 * On submit, creates/updates existing product
 * @returns {void}
 */
async function onSubmit(){

  // TODO verify all attrs, at least 1 image (form validation)
  if([input.value, input.minBet, input.maxBet].some((value) => value === undefined || value === null)){
    throw new Error('Wait, thats illegal')
  }

  // Parameters for creating/updating
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
            ...params
          }
        }
      )
    } else {
      // Case 2: CREATE
      mutationResult = await executeMutation(
        CREATE_PRODUCT,
        {
          createProductInput: params
        }
      )
    }

    if(!mutationResult){
      throw new Error('Product creation/update failed')
    }

    const mutationName = productId ? 'updateProduct' : 'createProduct'

  // Prepare variables for image upload TODO Update handling...
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const newProductId: string = mutationResult.data[mutationName].uuid as string
  const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL ??  ''
  const headers = { 'Content-Type': 'multipart/form-data' }

    // TODO move to backend in a single call
  // Upload all images
  for(const picture of pictures.value) {
    const formData = new FormData();
    if (picture.value) {
      // Convert to Blob and append
      const blob = picture.value as Blob
      formData.append('file', blob)
      await axios({
        method: 'post',
        url: `${baseUrl}/uploadPublicFile?productId=${newProductId}`,
        data: formData,
        headers: headers,
      }).catch((e: Error) => {
        throw new Error(`File upload error: ${e.message}`)
      })
    }
  }

  // Push to success page
  await $routerService?.routeTo(ROUTES.MY_PRODUCTS)
}

</script>
