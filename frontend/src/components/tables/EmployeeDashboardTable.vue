<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      v-model:selected="selected"
      card-style="border-radius: 8px; background-color: transparent"
      table-header-class="bg-transparent"
      color="transparent"
      :rows="rows"
      :columns="columns"
      :filter="props.search"
      :filter-method="tableFilter"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      separator="none"
      flat
    >
    <template #body="_props">
      <q-tr
        :props="_props"
        style="background-color: white; cursor: pointer"
      >
        <q-td key="date">
          {{ formatDate(_props.row.created_at) }}
        </q-td>
        <q-td key="customer">
          {{ _props.row.first_name + " " + _props.row.last_name }}
        </q-td>
        <q-td key="institute">
          {{ _props.row.original_bank.name }}
        </q-td>
        <q-td key="location">
          {{ _props.row.address.city }}
        </q-td>
        <q-td key="mortgage_amount">
          {{ _props.row.mortgage_amount.toLocaleString() }}
        </q-td>
        <q-td key="status">
          <q-chip
            :style="dossierChipStyle(_props.row.status)"
          >
            {{ $t('dossier_status_enum.' + _props.row.status) }}
          </q-chip>
          <q-popup-edit
            v-slot="scope"
            :auto-save="true"
            :model-value="_props.row.status"
            @save="(value) => onUpdateStatus(value, _props.row.uuid)"
          >
            <q-select
              v-model="scope.value"
              :option-label="(status)=>$t('dossier_status_enum.' + status)"
              :options="Object.keys(DOSSIER_STATUS)"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="uploads">
          <q-btn
            icon="download"
            color="primary"
            round
            @click="()=>showDossierDocuments(_props.row)"
          />
          <q-btn
            class="q-ml-sm"
            icon="upload_file"
            color="primary"
            round
            @click="()=>uploadDossierDocuments(_props.row)"
          />
        </q-td>
        <q-td key="offers" @click="()=>expandOffers(_props.row.uuid)">
          <q-chip
            v-for="(offer, index) in _props.row.offers"
            :key="index"
            :style="offerChipStyle(offer.status)"
          >
            {{ offer.bank.abbreviation }}
          </q-chip>
        </q-td>
        <q-td key="non_arrangeable">
          <q-icon v-if="_props.row.non_arrangeable" name="warning" size="30px" color="red"/>
        </q-td>
      </q-tr>
      <div v-if="expanded[_props.row.uuid]"
      >
        <q-tr v-for="offer in _props.row.offers"
              :key="offer.uuid"
              :props="_props"
              style="background-color: white; cursor: pointer"
        >
          <q-td> --></q-td>
          <q-td>{{offer.bank.name}}</q-td>
          <q-td>
            <q-chip
              :style="offerChipStyle(offer.status)"
            >
              {{ $t('offer_status_enum.' + offer.status) }}
            </q-chip>
          </q-td>
          <q-td>
            <q-btn
              icon="download"
              color="primary"
              round
              @click="()=>showOfferDocuments(offer)"
            />
          </q-td>
        </q-tr>
      </div>

      <!-- one spacer row per row -->
      <q-tr style="height: 14px"/>
    </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {computed, inject, Ref, ref} from 'vue';
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import UploadDocumentsDialog from 'src/components/dialogs/UploadDocumentsDialog.vue';
import DownloadDocumentsDialog from 'src/components/dialogs/DownloadDocumentsDialog.vue';
import {QVueGlobals, useQuasar} from 'quasar';
import {SET_DOSSIER_STATUS} from 'src/data/mutations/DOSSIER';
import {i18n} from 'boot/i18n';
import {DOSSIER_STATUS} from 'src/data/ENUM/ENUM';
import {showNotification} from 'src/helpers/notification-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import {tableFilter} from 'src/helpers/filter-helpers';
import {dossierChipStyle, offerChipStyle} from 'src/helpers/chip-helpers';
import {uploadFiles} from 'src/helpers/file-helpers';
import {MY_DOSSIERS} from 'src/data/queries/DOSSIER';
import {DOSSIER_FILE, OFFER_FILE} from 'src/data/queries/FILE';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';

const $q: QVueGlobals = useQuasar()
const $routerService: RouterService|undefined = inject('$routerService')

// Selection must be an array
const selected = ref([])

const props = defineProps({
    search: {
      type: String,
      default: ''
    }
  }
)

// ----- Data -----
const columns = [
  { name: 'date', label: i18n.global.t('employee_dashboard.date'), field: 'date', sortable: true, align: 'center' },
  // customer + customer id
  { name: 'customer', label: i18n.global.t('employee_dashboard.customer'), field: 'customer', sortable: true, align: 'center' },
  { name: 'institute', label: i18n.global.t('employee_dashboard.institute'), field: 'institute', sortable: true, align: 'center' },
  { name: 'location', label: i18n.global.t('employee_dashboard.location'), field: 'location', sortable: true, align: 'center' },
  { name: 'mortgage_amount', label: i18n.global.t('employee_dashboard.mortgage_amount'), field: 'mortgage_amount', sortable: true, align: 'center' },
  { name: 'status', label: i18n.global.t('employee_dashboard.status'), field: 'status', sortable: false, align: 'center' },
  { name: 'uploads', label: i18n.global.t('employee_dashboard.uploads'), field: 'uploads', sortable: false, align: 'center' },
  { name: 'offers', label: i18n.global.t('employee_dashboard.offers'), field: 'offers', sortable: false, align: 'center' },
  { name: 'non_arrangeable', label: ' ', field: 'non_arrangeable', sortable: true, align: 'center' },
]


const dossiers = subscribeToQuery(MY_DOSSIERS) as Ref<Record<string, Array<Record<string, unknown>>>>
const rows = computed( () => {
  return dossiers.value ?? []
})

const expanded: Ref<Record<string, boolean>> = ref({})


/**
 * Edits the dossier status and update the status with the selected item
 * @param {string} status - the status of the dossier
 * @param {string} uuid - the uuid
 * @returns {void}
 */
function onUpdateStatus(status: DOSSIER_STATUS, uuid:string){
  executeMutation(
    SET_DOSSIER_STATUS,
    {
      uuid: uuid,
      status: status,
    }
  ).then(()=>{
    showNotification(
      $q,
      i18n.global.t('messages.success'),
      undefined,
      'positive'
    )
  }).catch(()=>{
    showNotification(
      $q,
      i18n.global.t('messages.failure'),
      undefined,
      'negative'
    )
  })
}

/**
 * Routes to the page where documents can be uploaded for a given dossier
 * @param {Record<string, unknown>} dossier - the dossier
 * @returns {Promise<void>} - done
 */
async function uploadDossierDocuments(dossier: Record<string, unknown>) {
  await $routerService?.routeTo(ROUTES.DOSSIER_DOCUMENT_UPLOAD, {did: dossier.uuid})
}


/**
 * Shows a dialog where the dossier's files can be downloaded
 * @param {Record<string, unknown>} dossier - a dossier
 * @returns {void} - void
 */
function showDossierDocuments(dossier: Record<string, unknown>): void {
  const files: Record<string, unknown>[] = _.cloneDeep(dossier.documents) ?? []

  // Add final document, if any
  if(dossier.final_document){
    files.push(dossier.final_document)
    // TODO: this has no valid link to dossier... fix
  }

  $q.dialog({
    title: 'DownloadDocumentsDialog',
    component: DownloadDocumentsDialog,
    componentProps: {
      files,
      query: DOSSIER_FILE
    }
  })
}
/**
 * Shows a dialog where the offer's files can be downloaded
 * @param {Record<string, unknown>} offer - an offer
 * @returns {void} - void
 */
function showOfferDocuments(offer: Record<string, unknown>): void {
  const files = offer.documents ?? []
  $q.dialog({
    title: 'DownloadDocumentsDialog',
    component: DownloadDocumentsDialog,
    componentProps: {
      files,
      query: OFFER_FILE
    }
  })
}

/**
 * Expand row
 * @param {string} uuid - uuid of dossier to expand offers on
 * @returns {void}
 */
function expandOffers(uuid:string): void{
  expanded.value[uuid]= !expanded.value[uuid]
}


</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: -10px; /* correct offset on first border spacing if desired */
}
td {
  padding: 10px;
}
td:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
td:last-child {
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
