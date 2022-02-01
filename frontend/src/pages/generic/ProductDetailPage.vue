<template>
  <q-page class="flex justify-start q-pa-none q-ma-none">
    <div
      style="width: calc(100% - 32px)"
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
                readonly
              />

              <!-- Description -->
              <q-input
                v-model="product.description"
                class="q-ma-sm full-width"
                :label="$t('products.product_description')"
                outlined
                dense
                type="textarea"
                readonly
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
                readonly
              />
              <q-input
                v-model="product.category"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.category')"
                outlined
                dense
                readonly
              />
            </div>

            <!-- Start and End Date -->
            <div class="row flex justify-between">
              <!-- Start date -->
              <q-input
                v-model="product.start"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.start')"
                stack-label
                outlined
                dense
                readonly
              />

              <!-- End date -->
              <q-input
                v-model="product.end"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.end')"
                stack-label
                outlined
                dense
                readonly
              />
            </div>

            <!-- Value & currency -->
            <div class="row flex justify-between">
              <q-input
                v-model="product.value"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.value')"
                outlined
                dense
                readonly
              />
              <q-input
                v-model="product.currency"
                :options="currencies"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.currency')"
                outlined
                dense
                readonly
              />
            </div>

            <!-- Min/Max bet -->
            <div class="row flex justify-between">
              <q-input
                v-model="product.minBet"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.min_bet')"
                outlined
                dense
                readonly
              />

              <q-input
                v-model="product.maxBet"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.max_bet')"
                outlined
                dense
                readonly
              />
            </div>
          </div>
        </div>

      </q-card>

      <!-- Tags -->
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
            readonly
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
            <q-input
              v-model="product.sponsored"
              class="column"
              style="width: calc(50% - 25px)"
              :label="$t('products.promotion')"
              outlined
              dense
              readonly
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
              readonly
            />
            <q-input
              v-model="product.directBuyLinkMaxClicks"
              class="q-ma-sm col-2"
              :label="$t('products.max_clicks')"
              outlined
              dense
              readonly
            />
            <q-input
              v-model="product.directBuyLinkMaxCost"
              class="q-ma-sm col-2"
              :label="$t('products.max_cost')"
              outlined
              dense
              readonly
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
              readonly
            />
            <q-input
              v-model="product.brandLinkMaxClicks"
              class="q-ma-sm col-2"
              :label="$t('products.max_clicks')"
              outlined
              dense
              readonly
            />
            <q-input
              v-model="product.brandLinkMaxCost"
              class="q-ma-sm col-2"
              :label="$t('products.max_cost')"
              outlined
              dense
              readonly
            />
          </div>
        </q-card>
      </div>

      <!-- Images TODO Pictures are displayed a little wierdly-->
      <div class="row full-width">
        <q-card
          class="q-pa-md q-ma-md"
          flat
          style="width: 100%; border-radius: 20px; border: 1px solid black"
        >
          <h6 class="q-ma-md">{{ $tc('products.image', 2) }}</h6>
          <q-img
            v-for="(picture, index) in pictures"
            :key="index"
            :src="picture"
            :alt="index"
            class="q-ma-md"
            width="300px"
          />
        </q-card>
      </div>
      <!-- Submit -->
      <div class="row">
        <q-btn
          v-if="product.status === PRODUCT_STATUS.DRAFT || product.status === PRODUCT_STATUS.VALID"
          class="q-ma-md text-black"
          color="primary"
          :label="$t('general.edit')"
          rounded
          no-caps
          style="height: 50px;"
          @click="() => editProduct(product.uuid)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { inject, ref, Ref, watch } from 'vue';
import {useRoute} from 'vue-router';
import axios, {AxiosResponse} from 'axios';
import {RouterService} from 'src/services/RouterService';
import {toDataUrl} from 'src/helpers/image-helper';
import { CURRENCY, PRODUCT_STATUS } from '../../../../shared/definitions/ENUM';
import ROUTES from 'src/router/routes';
import { fetchProductInitially } from 'src/helpers/api-helpers';

const $routerService: RouterService|undefined = inject('$routerService')
const route = useRoute()

const currencies: CURRENCY[] = Object.values(CURRENCY).filter((item) => {
  return isNaN(Number(item))
})

const pictures: Ref<Array<string|ArrayBuffer|null>> = ref([])

const productId = route.query.id as string // TODO: Error handling if no ID given
const product = fetchProductInitially(productId)

console.log(product)

const stop = watch(product, async (val) => {
  const existingPictures: Array<string|ArrayBuffer|null> = []
  const newPictures = val.pictures
  await Promise.all(newPictures.map(picture => {
    const index: number = newPictures.indexOf(picture);
    return axios.get(
      picture.url,
      {
        responseType: 'blob'
      }).then(async (res: AxiosResponse<Blob>) => {
      const file = new File([res.data], `${product.title}_${index}`)
      const url = await toDataUrl(file)
      existingPictures.push(url)
    });
  }));
  pictures.value = existingPictures;
  stop();
})

/**
 * Routes to the product editing page for the given product
 * @param {string} uuid - the product's uuid
 * @async
 * @returns {void}
 */
async function editProduct(uuid: string): Promise<void>{
  await $routerService?.routeTo(
    ROUTES.ADD_PRODUCT,
    {
      id: uuid
    }
  )
}

</script>
<style>
/* q-input readonly looks ugly without this */
.q-field--outlined.q-field--readonly .q-field__control:before {
  border-style: solid;
}
</style>
