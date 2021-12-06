<template>
  <q-page class="flex justify-center">
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
            />

            <!-- Description TODO Fix field height-->
            <q-input
              v-model="input.description"
              class="q-ma-sm full-width"
              :label="$t('products.product_description')"
              outlined
              dense
              autogrow
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
            <q-input
              v-model="input.category"
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
            />

            <!-- End date -->
            <q-input
              v-model="input.end"
              class="q-ma-sm"
              style="width: calc(50% - 25px)"
              :label="$t('products.end')"
              stack-label
              type="date"
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
            />

            <q-input
              v-model="input.maxBet"
              class="q-ma-sm"
              style="width: calc(50% - 25px)"
              :label="$t('products.max_bet')"
              type="number"
              outlined
              dense
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
        <div class="row flex justify-between q-ma-md">

          <!-- Status -->
          <q-select
            v-model="input.status"
            :options="status"
            class="column q-ma-sm"
            style="width: calc(50% - 25px)"
            :label="$t('products.status')"
            outlined
            dense
          />

          <!-- Type -->
          <q-select
            v-model="input.type"
            :options="type"
            class="column q-ma-sm"
            style="width: calc(50% - 25px)"
            :label="$t('products.type')"
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
            v-model="input.product_page_link"
            class="q-ma-sm col-7"
            :label="$t('products.product_page_link')"
            outlined
            dense
          />
          <q-input
            v-model="input.product_page_max_clicks"
            class="q-ma-sm col-2"
            :label="$t('products.max_clicks')"
            type="number"
            outlined
            dense
          />
          <q-input
            v-model="input.product_page_max_cost"
            class="q-ma-sm col-2"
            :label="$t('products.max_cost')"
            type="number"
            outlined
            dense
          />
        </div>

        <!-- Seller Page -->
        <div class="row flex justify-between">
          <!-- Seller Page Link -->
          <q-input
            v-model="input.seller_page_link"
            class="q-ma-sm col-7"
            :label="$t('products.seller_page_link')"
            outlined
            dense
          />
          <q-input
            v-model="input.seller_page_max_clicks"
            class="q-ma-sm col-2"
            :label="$t('products.max_clicks')"
            type="number"
            outlined
            dense
          />
          <q-input
            v-model="input.seller_page_max_cost"
            class="q-ma-sm col-2"
            :label="$t('products.max_cost')"
            type="number"
            outlined
            dense
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
        style="width: 150px; height: 50px;"
        color="primary"
        :label="$t('buttons.submit')"
        @click="onSubmit"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {reactive, Ref, ref} from 'vue';
import PictureUpload from 'components/forms/fields/PictureUpload.vue';
import {executeMutation} from 'src/helpers/data-helpers';
import {CREATE_PRODUCT} from 'src/data/mutations/PRODUCT';
import axios from 'axios';
import {date} from 'quasar';
import { CURRENCY, PRODUCT_STATUS, PRODUCT_TYPE } from '../../../shared/definitions/ENUM'

const currencies = Object.keys(CURRENCY).filter((item) => {
  return isNaN(Number(item))
})
const status = Object.values(PRODUCT_STATUS).filter((item) => {
  return isNaN(Number(item));
})
const type = Object.values(PRODUCT_TYPE).filter((item) => {
  return isNaN(Number(item));
})

// Inputs for CREATE_PRODUCT mutation // TODO define Joi type
const input = reactive({
  title: null,
  description: null,
  brand: null,
  value: 0,
  currency: null, // TODO Fetch last selected or depening on location?
  start: date.formatDate(Date.now(), 'YYYY-MM-DD'),
  end: date.formatDate(date.addToDate(Date.now(), {days: 7}), 'YYYY-MM-DD'),
  category: null,
  directBuyLink: null,
  brandLink: null,
  minBet: null,
  maxBet: null,
  tags: null,
  status: null,
  type: null,
  seller_page_link: null,
  seller_page_max_clicks: 0,
  seller_page_max_cost: 0,
  product_page_link: null,
  product_page_max_clicks: 0,
  product_page_max_cost: 0,
})



// Picture inputs (separated from input, since these have to be added after product is created)
const pictures: Ref<Array<Ref<File>>> = ref([])

/**
 * TODO
 * @param newPictures
 */
function onPictureChange(newPictures: Ref<File>[]){
  pictures.value = newPictures
}

  /**
 * TODO
 */
async function onSubmit(){

  // TODO verify all attrs, at least 1 image (form validation)
  if([input.value, input.minBet, input.maxBet].some((value) => value === undefined || value === null)){
    throw new Error('Wait, thats illegal')
  }

  // Create on database
  const mutationResult = await executeMutation(
    CREATE_PRODUCT,
    {
      createProductInput: {
        ...input,
        value: Number.parseInt(input.value ?? ''), // Convert 'value' to int TODO can this be done on QInput directly?
        minBet: Number.parseInt(input.minBet ?? ''),
        maxBet: Number.parseInt(input.maxBet ?? ''),
      }
    }
  )

  if(!mutationResult){
    throw new Error('Product creation failed')
  }

  // Prepare variables for image upload TODO
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  const newProductId: string = mutationResult.data.createProduct.uuid
  const baseUrl = process.env.VUE_APP_BACKEND_BASE_URL ??  ''
  const headers = { 'Content-Type': 'multipart/form-data' }

  console.log('New prod:', newProductId)

  // Upload all images
  for(const picture of pictures.value) {
    const formData = new FormData();
    if (picture.value) {
      // Convert to Blob and append
      const blob = picture.value as Blob
      formData.append('file', blob)

      console.log('POST file') // TODO remove

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

  console.log('Done!')

  // // Push to success page
  // setTimeout(function() {$routerService?.routeTo(ROUTES.LOGIN)}, 5000);
  // await $routerService?.routeTo(ROUTES.SUCCESS)
  return;
}

</script>
