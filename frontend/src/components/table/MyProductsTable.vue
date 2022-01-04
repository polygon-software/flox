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
          v-if="statusFilter ? props.row.status === statusFilter : true"
          :props="props"
          class="q-ma-none q-pa-none"
          style="cursor: pointer"
        >
          <q-td key="pictures" :props="props">
            <img
              v-if="props.row.pictures && props.row.pictures[0] && props.row.pictures[0].url"
              class="bg-grey-3"
              :src="props.row.pictures[0].url"
              style="min-width: 140px; max-width: 140px; min-height: 90px; max-height: 90px; border-radius: 4px; object-fit: cover"
              :alt="props.row.title"
            >
            <div
              v-else
              style="width: 120px; height: 90px; color: grey"
            >

            </div>
          </q-td>
          <q-td key="title" :props="props">
            {{ props.row.title ?? '-' }}
          </q-td>
          <q-td key="brand" :props="props">
            {{ props.row.brand ?? '-' }}
          </q-td>
          <q-td key="status" :props="props">
            <q-chip
              :label=getStatusChip(props.row).label
              :color="getStatusChip(props.row).color"
              text-color="white"
              style="font-weight: bold"
            />
          </q-td>
          <q-td key="sponsored" :props="props">
            <!-- TODO i18n -->
            {{ props.row.sponsored ? 'Sponsored' : 'Normal' }}
          </q-td>
          <q-td key="start" :props="props">
            {{ props.row.start ? formatDate(new Date(props.row.start)) : '-' }}
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
                  v-if="isEditable(props.row)"
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
                  @click="() => duplicateProduct(props.row.uuid)"
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
import {computed, defineProps, inject, Ref} from 'vue';
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {PRODUCT_STATUS} from '../../../../shared/definitions/ENUM';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {DUPLICATE_PRODUCT} from 'src/data/mutations/PRODUCT';
import {FetchResult} from '@apollo/client';
import {sleep} from 'src/helpers/general-helpers';
import {i18n} from 'boot/i18n';
import {MY_PRODUCTS} from 'src/data/queries/PRODUCT';
import {ErrorService} from 'src/services/ErrorService';

const $errorService: ErrorService|undefined = inject('$errorService')
const $routerService: RouterService|undefined = inject('$routerService')

defineProps( {
  search: {
    required: true,
    type: String,
    default: null,
  },
  statusFilter: {
    required: false,
    type: String,
    default: null,
  }
})

const columns = [
  { name: 'pictures', label: '', field: 'uuid', sortable: false, align: 'center'},
  { name: 'title', label: i18n.global.t('products.title'), field: 'title', sortable: true, align: 'center' },
  { name: 'brand', label: i18n.global.t('products.brand'), field: 'brand', sortable: true, align: 'center' },
  { name: 'status', label: i18n.global.t('products.status'), field: 'status', sortable: true, align: 'center' },
  { name: 'sponsored', label: i18n.global.t('products.type'), field: 'sponsored', sortable: true, align: 'center' },
  { name: 'start', label: i18n.global.t('products.start'), field: 'start', sortable: true, align: 'center' },
  { name: 'tags', label: '', field: 'tags', sortable: false }, // Invisible column, used for filtering only
  { name: 'options', label: '', field: 'options', sortable: false, align: 'center'},
]

const queryResult = subscribeToQuery(MY_PRODUCTS) as Ref<Array<Record<string, unknown>>>

// Rows, filtered by status (if applicable)
const computedResult = computed(() => {
  return queryResult.value ?? []
})

/**
 * Determines whether a product should be editable (if it's either a draft, or a valid product that hasn't started yet
 * TODO: change input type to Joi type
 * @param {Record<string, unknown>} product - the selected product
 * @returns {boolean} - whether it's editable
 */
function isEditable(product: Record<string, unknown>): boolean{
  const status: PRODUCT_STATUS = product.status as PRODUCT_STATUS
  const isDraft =  status === PRODUCT_STATUS.DRAFT
  const isValid = status === PRODUCT_STATUS.VALID
  const hasNotStarted =  product.start !== null && (new Date(product.start as string) >= new Date())
  return isDraft || (isValid && hasNotStarted)
}

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

/**
 * Duplicates a given product, and routes to the page allowing editing
 * @param {string} uuid - the UUID of the existing product to duplicate
 * @returns {void}
 */
async function duplicateProduct(uuid: string): Promise<void>{

  // Create new Product
  const mutationResult: FetchResult<any, Record<string, any>, Record<string, any>> | null = await executeMutation(
    DUPLICATE_PRODUCT,
    {
      duplicateProductInput: {
        uuid,
      }
    }) as Record<string, unknown>

  const newData: Record<string, Record<string, unknown>> = mutationResult.data as Record<string, Record<string, unknown>>;
  const newProduct: Record<string, unknown> = newData.duplicateProduct;

  if(!mutationResult || !mutationResult.data || !newProduct || !newProduct.uuid){
    $errorService?.showErrorDialog(
      new Error(i18n.global.t('errors.duplication_error'))
    )
  }

  // Ensure product correctly created and route to edit screen
  if(newProduct && newProduct.uuid && typeof newProduct.uuid === 'string'){
    // Wait briefly before routing
    await sleep()

    await $routerService?.routeTo(
      ROUTES.ADD_PRODUCT,
      {
        id: newProduct.uuid
      }
    )
  } else{
    $errorService?.showErrorDialog(
      new Error(i18n.global.t('errors.duplication_error'))
    )
  }
}

/**
 * Gets the color & label for the status chip of a product
 * @param {Record<string, unknown>} product - the product
 * @returns {string|null} - the chip's color, if any
 */
function getStatusChip(product: Record<string, unknown>): Record<string,unknown>|null {
  switch(product.status){
    case PRODUCT_STATUS.DRAFT:
      // Draft
      return {
        label: i18n.global.t('product_status.draft'),
        color: 'primary'
      }
    case PRODUCT_STATUS.VALID:
      if(isEditable(product)){
        // Valid & not yet active
        return {
          label: i18n.global.t('product_status.valid'),
          color: 'primary'
        }
      }
      // Valid & active
      return {
        label: i18n.global.t('product_status.active'),
        color: 'positive'
      }
    case PRODUCT_STATUS.ARCHIVED:
      // Archived
      return {
        label: i18n.global.t('product_status.archived'),
        color: 'neutral'
      }
    default:
      return {
        label: '-',
        color: null
      }
  }
}
</script>
