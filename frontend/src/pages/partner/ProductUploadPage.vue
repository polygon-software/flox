<template>
  <q-page class="flex justify-start q-pa-none q-ma-none">
    <q-form
      v-if="product"
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
                v-model="product.title"
                class="q-ma-sm full-width"
                :label="$t('products.product_name')"
                outlined
                dense
                lazy-rules
                :rules="[ (val) => IS_VALID_STRING(val) || $t('errors.invalid_input')]"
              />

              <!-- Description -->
              <q-input
                v-model="product.description"
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
                v-model="product.brand"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.brand')"
                outlined
                dense
              />
              <q-select
                v-model="product.category"
                :options="categories"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.category')"
                outlined
                dense
              />
            </div>

            <!-- Start and End Date -->
            <div class="row flex justify-between">
              <!-- Start date -->
              <q-input
                v-model="startDate"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.start')"
                stack-label
                mask="##.##.####"
                outlined dense
                lazy-rules
                :rules="[ (val) => (val === null || IS_FUTURE_DATE(val)) || $t('errors.date_must_be_future')]"
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="startDate" mask="DD.MM.YYYY" >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <!-- End date -->
              <!-- TODO ensure date is at least some time (24h?) after start -->
              <q-input
                v-model="endDate"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.end')"
                stack-label
                mask="##.##.####"
                outlined dense
                lazy-rules
                :rules="[ (val) => (val === null || IS_FUTURE_DATE(val)) || $t('errors.date_must_be_future')]"
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="endDate" mask="DD.MM.YYYY" >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- Value & currency -->
            <div class="row flex justify-between">
              <q-input
                v-model.number="product.value"
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
                v-model="product.currency"
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
                v-model.number="product.minBet"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.min_bet')"
                type="number"
                outlined
                dense
                lazy-rules="ondemand"
                :rules="[ (val) => (val === null || val === '' || IS_VALID_MIN_BET(val, product.maxBet, product.value)) || $t('errors.invalid_number')]"
              />

              <q-input
                v-model.number="product.maxBet"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.max_bet')"
                type="number"
                outlined
                dense
                lazy-rules="ondemand"
                :rules="[ (val) => (val === null || val === '' || IS_VALID_MAX_BET(val, product.minBet, product.value)) || $t('errors.invalid_number')]"
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
            v-model="product.tags"
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
              v-model="product.sponsored"
              :options="sponsoredOptions"
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
              v-model="product.directBuyLink"
              class="q-ma-sm col-7"
              :label="$t('products.product_page_link')"
              outlined
              dense
              type="url"
              :rules="[ (val) => !val || val === '' || IS_URL(val)]"
            />
            <q-input
              v-model.number="product.directBuyLinkMaxClicks"
              class="q-ma-sm col-2"
              :label="$t('products.max_clicks')"
              type="number"
              outlined
              dense
              :rules="[ (val) => !val || val === ''|| val === 0 || IS_LARGER_THAN(val, 0)]"
            />
            <q-input
              v-model.number="product.directBuyLinkMaxCost"
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
              v-model="product.brandLink"
              class="q-ma-sm col-7"
              :label="$t('products.seller_page_link')"
              outlined
              dense
              type="url"
              :rules="[ (val) => !val || val === '' || IS_URL(val)]"
            />
            <q-input
              v-model.number="product.brandLinkMaxClicks"
              class="q-ma-sm col-2"
              :label="$t('products.max_clicks')"
              type="number"
              outlined
              dense
              :rules="[ (val) => !val || val === '' || val === 0 || IS_LARGER_THAN(val, 0)]"
            />
            <q-input
              v-model.number="product.brandLinkMaxCost"
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
          :label="product.status === PRODUCT_STATUS.VALID ? $t('buttons.submit') : $t('buttons.save_draft')"
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
import {computed, inject, Ref, ref, watch} from 'vue';
import PictureUpload from 'components/forms/fields/PictureUpload.vue';
import {executeMutation} from 'src/helpers/data-helpers';
import {CREATE_PRODUCT, UPDATE_PRODUCT} from 'src/data/mutations/PRODUCT';
import {i18n} from 'boot/i18n';
import {CATEGORY, CURRENCY, PRODUCT_STATUS} from '../../../definitions/ENUM'
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {useRoute} from 'vue-router';
import axios, { AxiosResponse } from 'axios'
import {
  IS_FUTURE_DATE,
  IS_LARGER_THAN,
  IS_URL,
  IS_VALID_MAX_BET,
  IS_VALID_MIN_BET,
  IS_VALID_NUMBER,
  IS_VALID_STRING
} from 'src/data/RULES';
import { toBase64 } from 'src/helpers/image-helper';
import { formatDate, parseDate } from 'src/helpers/format-helpers';
import { fetchProduct } from 'src/helpers/api-helpers';
import { Product } from 'src/data/types/Product';

const $routerService: RouterService|undefined = inject('$routerService')
const route = useRoute()

const productId = route.query.id as string
const product = productId ? fetchProduct(productId) : ref(new Product({}))

const startDate = computed({
  get: () => product.value?.start ? formatDate(product.value.start) : '',
  set: (dateString) => {
    if(product.value !== null) {
      product.value.start = parseDate(dateString)
    }
  },
})

const endDate = computed({
  get: () => product.value?.end ? formatDate(product.value.end) : '',
  set: (dateString) => {
    if(product.value !== null) {
      product.value.end = parseDate(dateString)
    }
  },
})

// Read ENUM values and so they can be used as options
const categories = Object.values(CATEGORY).filter((item) => {
  return isNaN(Number(item))
})

const currencies: CURRENCY[] = Object.values(CURRENCY).filter((item) => {
  return isNaN(Number(item))
})

const sponsoredOptions = [{value: true, label: i18n.global.t('general.yes')}, {value: false, label: i18n.global.t('general.no')}]

const status = computed(() => {
  if (
    [
      product.value?.title,
      product.value?.description,
      product.value?.brand,
      product.value?.value,
      product.value?.currency,
      product.value?.start,
      product.value?.end,
      product.value?.category,
      product.value?.minBet,
      product.value?.maxBet,
      product.value?.sponsored,
    ]
      .some((value) => value === null || (typeof value === 'string' && value === '')))
  {
    return PRODUCT_STATUS.DRAFT
  }
  return PRODUCT_STATUS.VALID
})

// Check if all required fields have been filled. If yes, set the product status to valid
watch(status, (val) => {
  if(product.value) {
    product.value.status = val
  }
})

// Picture inputs (separated from input, since these have to be added after product is created)
const pictures: Ref<Array<Ref<File>>> = ref([])
const oldPictures: Ref<Array<string|ArrayBuffer|null>> = ref([])

const stop = watch(product, async (val) => {
  if(val?.uuid) {
    const existingPictures: Array<Ref<File>> = []
    const newPictures = val.pictures;
    for (const picture of newPictures) {
      const index: number = newPictures.indexOf(picture);
      await axios.get(
        picture.url,
        {
          responseType: 'blob'
        }).then(async (res: AxiosResponse<Blob>) => {
        const file = new File([res.data], `${val.title as string}_${index}`)
        existingPictures.push(ref(file))

        // This array is used to remember which pictures currently exist
        const b64Picture = await toBase64(file)
        if (!oldPictures.value.includes(b64Picture)) {
          oldPictures.value.push(b64Picture)
        }
      });
    }
    pictures.value = existingPictures;
    stop();
  }
})

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
  if(product.value) {
    // Parameters for creating/updating
    const base64Pictures: Array<string | ArrayBuffer | null> = []
    for (const picture of pictures.value) {
      if (picture.value) {
        const base64String = await toBase64(picture.value)
        base64Pictures.push(base64String)
      }
    }

    const params = {
      title: product.value.title,
      description: product.value.description,
      brand: product.value.brand,
      category: product.value.category,
      start: product.value.start,
      end: product.value.end,
      value: product.value.value,
      currency: product.value.currency,
      minBet: product.value.minBet,
      maxBet: product.value.maxBet,
      tags: product.value.tags,
      sponsored: product.value.sponsored,
      directBuyLink: product.value.directBuyLink,
      directBuyLinkMaxClicks: product.value.directBuyLinkMaxClicks,
      directBuyLinkMaxCost: product.value.directBuyLinkMaxCost,
      brandLink: product.value.brandLink,
      brandLinkMaxClicks: product.value.brandLinkMaxClicks,
      brandLinkMaxCost: product.value.brandLinkMaxCost,
      status: product.value.status,
    }

    let mutationResult

    if (productId) {
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

    if (!mutationResult) {
      throw new Error('Product creation/update failed')
    }

    // Push to success page
    await $routerService?.routeTo(ROUTES.MY_PRODUCTS)
  }
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
