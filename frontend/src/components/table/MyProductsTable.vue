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
          @click="() => editProduct(props.row)"
        >
          <q-td key="uuid" :props="props">
            <img
              v-if="props.row.pictures[0] && props.row.pictures[0].url"
              :src="props.row.pictures[0].url"
              style="max-width: 120px; height: 90px"
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
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, inject, ref, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {MY_PRODUCTS} from 'src/data/queries/QUERIES';
import {PRODUCT_STATUS} from '../../../../shared/definitions/ENUM';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {showNotification} from 'src/helpers/notification-helpers';
import {useQuasar} from 'quasar';
import {i18n} from 'boot/i18n';
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
  { name: 'uuid', label: '', field: 'uuid', sortable: true },
  { name: 'title', label: 'Product', field: 'title', sortable: true },
  { name: 'brand', label: 'Brand', field: 'brand', sortable: true },
  { name: 'status', label: 'Status', field: 'status', sortable: true },
  { name: 'sponsored', label: 'Type', field: 'sponsored', sortable: true },
  { name: 'start', label: 'Start Date', field: 'start', sortable: true },
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
 * @param {Record<string, string>} product - the product to edit (used for pre-filling form)
 */
function editProduct(product: Record<string, string>){
  // Notify user for non-editable products
  if(product.status !== PRODUCT_STATUS.DRAFT){
    // TODO: Alternatively route to product view?
    showNotification(
      $q,
      i18n.global.t('errors.can_only_edit_draft'),
      'bottom',
      'negative'

    )
  } else {
    console.log('Update product', product)

    $routerService?.routeTo(
      ROUTES.ADD_PRODUCT,
      {
        id: product.uuid
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
