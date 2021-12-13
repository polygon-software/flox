<template>
  <div class="column full-width">
    <q-table
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      :filter="search"
      flat
      bordered
    >
      <template #body="props">
        <q-tr
          :props="props"
          class="q-ma-none q-pa-none"
          style="cursor: pointer"
        >
          <q-td key="pictures" :props="props">
            <img
              v-if="props.row.pictures[0] && props.row.pictures[0].url"
              :src="props.row.pictures[0].url"
              style="max-width: 120px; height: 90px"
              :alt="props.row.title"
            >
          </q-td>
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="brand" :props="props">
            {{ props.row.brand }}
          </q-td>
          <q-td key="status" :props="props">
            <q-chip
              :label="$t('product_status.' + props.row.status.toLowerCase())"
              :color="getChipColor(props.row.status)"
              text-color="white"
              style="font-weight: bold"
            />
          </q-td>
          <q-td key="sponsored" :props="props">
            <!-- TODO i18n -->
            {{ props.row.sponsored ? 'Sponsored' : 'Normal' }}
          </q-td>
          <q-td key="start" :props="props">
            {{ formatDate(new Date(props.row.start)) }}
          </q-td>
          <q-td key="options" :props="props">
            <q-btn-dropdown
              dropdown-icon="more_vert"
              auto-close
              no-icon-animation
              flat
              round
              dense
              @click="showOptions = !showOptions"
            >
              <div class="column">
                <!-- Edit button (drafts only) -->
                <q-btn
                  v-if="props.row.status === PRODUCT_STATUS.DRAFT"
                  :label="$t('general.edit')"
                  icon="edit"
                  class="text-black"
                  flat
                  no-caps
                  @click="() => editProduct(props.row.uuid)"
                />

                <!-- View button (non-drafts) -->
                <q-btn
                  v-else
                  :label="$t('general.view')"
                  icon="wysiwyg"
                  class="text-black"
                  flat
                  no-caps
                  @click="() => viewProduct(props.row.uuid)"
                />

                <q-btn
                  :label="$t('general.duplicate')"
                  icon="content_copy"
                  class="text-black"
                  flat
                  no-caps
                  @click="() => duplicateProduct(props.row)"
                />
              </div>
            </q-btn-dropdown>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, inject, ref, Ref} from 'vue';
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {MY_PRODUCTS} from 'src/data/queries/QUERIES';
import {PRODUCT_STATUS} from '../../../../shared/definitions/ENUM';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {useQuasar} from 'quasar';
import {CREATE_PRODUCT} from 'src/data/mutations/PRODUCT';
import {FetchResult} from '@apollo/client';
const $routerService: RouterService|undefined = inject('$routerService')
const $q = useQuasar()

const props = defineProps( {
  search: {
    required: true,
    type: String,
  },
  statusFilter: {
    required: true,
    type: String,
  }
})

// TODO i18n
const columns = [
  { name: 'pictures', label: '', field: 'uuid', sortable: true },
  { name: 'title', label: 'Product', field: 'title', sortable: true },
  { name: 'brand', label: 'Brand', field: 'brand', sortable: true },
  { name: 'status', label: 'Status', field: 'status', sortable: true },
  { name: 'sponsored', label: 'Type', field: 'sponsored', sortable: true },
  { name: 'start', label: 'Start Date', field: 'start', sortable: true },
  { name: 'tags', label: '', field: 'tags', sortable: false }, // Invisible column, used for filtering only
  { name: 'options', label: '', field: 'options', sortable: false },
]

const queryResult = subscribeToQuery(MY_PRODUCTS) as Ref<Array<Record<string, unknown>>>

// Rows, filtered by status (if applicable)
const computedResult = computed(() => {
  const val = queryResult.value ?? []

  // Status filter (if any
  if(props.statusFilter !== 'all') {
    return val.filter((row) => row.status === props.statusFilter)
  }

  return val
})

/**
 * Routes to the product editing page for the given product
 * TODO: type to Joi type
 * @param {string} uuid - the product's uuid
 */
function editProduct(uuid: string): void{
  $routerService?.routeTo(
    ROUTES.ADD_PRODUCT,
    {
      id: uuid
    }
  )
}



async function duplicateProduct(product: Record<string, unknown>): Promise<void>{

  // Set up params for new product creation
  const params = {
    createProductInput: {
      title: product.title,
      description: product.description,
      brand: product.brand,
      category: product.category,
      value: product.value,
      currency: product.currency,
      start: product.start, //TODO does not make sense
      end: product.end, //TODO does not make sense
      // TODO: Pictures? how to handle...
      status: PRODUCT_STATUS.DRAFT,
      sponsored: product.sponsored,
      directBuyLink: product.directBuyLink,
      directBuyLinkMaxClicks: product.directBuyLinkMaxClicks,
      directBuyLinkMaxCost: product.directBuyLinkMaxCost,
      brandLink: product.brandLink,
      brandLinkMaxClicks: product.brandLinkMaxClicks,
      brandLinkMaxCost: product.brandLinkMaxCost,
      minBet: product.minBet,
      maxBet: product.maxBet,
      tags: product.tags
    }
  }

  // Create new Product
  const mutationResult: FetchResult<any, Record<string, any>, Record<string, any>> | null = await executeMutation(CREATE_PRODUCT, params) as Record<string, unknown>

  if(!mutationResult || !mutationResult.data){
    throw new Error('Creation FAILED') // TODO errorservice popup
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const newData: Record<string, Record<string, unknown>> = mutationResult.data;
  const newProduct: Record<string, unknown> = newData.createProduct;

  // Ensure product correctly created and route to edit screen
  if(newProduct && newProduct.uuid && typeof newProduct.uuid === 'string'){
    $routerService?.routeTo(
      ROUTES.ADD_PRODUCT,
      {
        id: newProduct.uuid
      }
    )
  }
}

/**
 * Gets the color for the status chip of a product
 * @param {PRODUCT_STATUS} status - the status of the product
 */
function getChipColor(status: string): string|null {
  switch(status){
    case PRODUCT_STATUS.DRAFT:
      return 'primary'
    case PRODUCT_STATUS.ACTIVE:
      return 'positive'
    case PRODUCT_STATUS.ENDED:
      return 'orange'
    case PRODUCT_STATUS.ARCHIVED:
      return 'neutral'
    default:
      return null
  }
}


</script>
