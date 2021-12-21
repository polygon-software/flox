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
                v-model="input.title"
                class="q-ma-sm full-width"
                :label="$t('products.product_name')"
                outlined
                dense
                readonly
              />

              <!-- Description -->
              <q-input
                v-model="input.description"
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
                v-model="input.brand"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.brand')"
                outlined
                dense
                readonly
              />
              <q-input
                v-model="input.category"
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
                v-model="input.start"
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
                v-model="input.end"
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
                v-model="input.value"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.value')"
                outlined
                dense
                readonly
              />
              <q-input
                v-model="input.currency"
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
                v-model="input.minBet"
                class="q-ma-sm"
                style="width: calc(50% - 25px)"
                :label="$t('products.min_bet')"
                outlined
                dense
                readonly
              />

              <q-input
                v-model="input.maxBet"
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
              v-model="input.sponsored"
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
              v-model="input.directBuyLink"
              class="q-ma-sm col-7"
              :label="$t('products.product_page_link')"
              outlined
              dense
              type="url"
              readonly
            />
            <q-input
              v-model="input.directBuyLinkMaxClicks"
              class="q-ma-sm col-2"
              :label="$t('products.max_clicks')"
              outlined
              dense
              readonly
            />
            <q-input
              v-model="input.directBuyLinkMaxCost"
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
              v-model="input.brandLink"
              class="q-ma-sm col-7"
              :label="$t('products.seller_page_link')"
              outlined
              dense
              readonly
            />
            <q-input
              v-model="input.brandLinkMaxClicks"
              class="q-ma-sm col-2"
              :label="$t('products.max_clicks')"
              outlined
              dense
              readonly
            />
            <q-input
              v-model="input.brandLinkMaxCost"
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
          v-if="input.status === PRODUCT_STATUS.DRAFT || input.status === PRODUCT_STATUS.VALID"
          class="q-ma-md text-black"
          color="primary"
          :label="$t('buttons.edit')"
          rounded
          no-caps
          style="height: 50px;"
          @click="() => editProduct(input.uuid)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {inject, reactive, ref, Ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {PRODUCT} from 'src/data/queries/QUERIES';
import {sleep} from 'src/helpers/general-helpers';
import axios, {AxiosResponse} from 'axios';
import {RouterService} from 'src/services/RouterService';
import {toDataUrl} from 'src/helpers/image-helper';
import {i18n} from 'src/boot/i18n';
import {toPascalCase} from 'src/helpers/string-helpers';
import {PRODUCT_STATUS} from '../../../shared/definitions/ENUM'
import ROUTES from 'src/router/routes';

const $routerService: RouterService|undefined = inject('$routerService')
const route = useRoute()
const productId = route.query.id
const queryResult = productId ? subscribeToQuery(PRODUCT, {uuid: productId}) as Ref<Record<string, unknown>> : ref(null)
const pictures: Ref<Array<string|ArrayBuffer|null>> = ref([])
const input: Record<string, unknown> = reactive(
  {
    uuid: null,
    title: null,
    description: null,
    brand: null,
    value: null,
    currency: null,
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
  }
)

/**
* Watch for first result if a product is given
*/
// eslint-disable-next-line sonarjs/cognitive-complexity
const stop = watch(queryResult, async (newValue) => {
  if(newValue && newValue !== {} && !(Array.isArray(newValue) && newValue.length === 0)){
    // Wait for 100ms before prefilling form to avoid hydration mismatches & UI bugs in fields
    await sleep(100)

    // Manually handle each field, since some fields are special
    input.uuid = newValue.uuid
    input.title = newValue.title
    input.description = newValue.description
    input.brand = newValue.brand
    input.category = toPascalCase(newValue.category)
    input.value = newValue.value !== '' ? newValue.value : null
    input.currency = newValue.currency
    input.minBet = newValue.minBet !== '' ? newValue.minBet : null
    input.maxBet = newValue.maxBet !== '' ? newValue.maxBet : null
    input.sponsored = newValue.sponsored ? i18n.global.t('general.yes') : i18n.global.t('general.mo')
    input.tags = newValue.tags
    input.status = newValue.status as PRODUCT_STATUS
    input.directBuyLink = newValue.directBuyLink !== '' ? newValue.directBuyLink : null
    input.directBuyLinkMaxClicks = newValue.directBuyLinkMaxClicks !== '' ? newValue.directBuyLinkMaxClicks : null
    input.directBuyLinkMaxCost = newValue.directBuyLinkMaxCost !== '' ? newValue.directBuyLinkMaxCost : null
    input.brandLink = newValue.brandLink !== '' ? newValue.brandLink : null
    input.brandLinkMaxClicks = newValue.brandLinkMaxClicks !== '' ? newValue.brandLinkMaxClicks : null
    input.brandLinkMaxCost = newValue.brandLinkMaxCost !== '' ? newValue.brandLinkMaxCost : null

    // Dates: extract substring for date-only
    input.start = newValue.start ? (newValue.start as string).substring(0, 10) : null
    input.end = newValue.end ? (newValue.end as string).substring(0, 10) : null
    // Pictures
    const existingPictures: Array<string|ArrayBuffer|null> = []
    for (const picture of newValue.pictures) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
      const index: number = newValue.pictures.indexOf(picture);
      await axios.get(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        picture.url,
        {
          responseType: 'blob'
        }).then(async (res: AxiosResponse<Blob>) => {
        const file = new File([res.data], `${(input as Record<string, string>).title}_${index}`)
        const url = await toDataUrl(file)
        existingPictures.push(url)
      });
    }
    pictures.value = existingPictures
    // Stop watcher, since we already got initial values
    stop()
  }
})

/**
 * Routes to the product editing page for the given product
 * @param {string} uuid - the product's uuid
 * @async
 * @returns {void}
 */
async function editProduct(uuid: string): Promise<void>{
  //TODO Pass props, to that not everything needs to be fetched again
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
