<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      v-model:selected="selected"
      card-style="border-radius: 8px; background-color: transparent"
      table-header-class="bg-transparent"
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
        <q-td key="date">
          {{ formatDateTime(_props.row.last_modified_at) }}
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
          {{ _props.row.mortgage_amount.toLocaleString('de-ch') }}
        </q-td>
        <q-td key="status">
          <q-chip
            :style="dossierChipStyle(_props.row.status)"
          >
            {{ $t('dossier_status_enum.' + _props.row.status) }}
          </q-chip>
          <q-popup-edit
            v-if="!employeeUuid"
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
            icon="picture_as_pdf"
            color="primary"
            round
            @click="()=>showDossierDocuments(_props.row)"
          />
        </q-td>
        <q-td key="offers" @click="()=> expandOffers(_props.row.uuid)">
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
        <q-td key="options">
          <!-- Dropdown options for editing -->
          <q-btn-dropdown
            dropdown-icon="more_vert"
            auto-close
            no-icon-animation
            flat
            round
            dense
            @click.stop=""
          >
            <div class="column">
              <!-- 'Disable' button for active accounts -->
              <q-btn
                :label="$t('buttons.edit')"
                icon="edit"
                class="text-black"
                flat
                no-caps
                :disable="employeeUuid"
                @click="() => onEditDossier(_props.row)"
              />
            </div>
          </q-btn-dropdown>
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
import DocumentsDialog from 'components/dialogs/DocumentsDialog.vue';
import {QVueGlobals, useQuasar} from 'quasar';
import {SET_DOSSIER_STATUS} from 'src/data/mutations/DOSSIER';
import {i18n} from 'boot/i18n';
import {DOSSIER_STATUS} from 'src/data/ENUM/ENUM';
import {showNotification} from 'src/helpers/notification-helpers';
import {formatDate, formatDateTime} from 'src/helpers/format-helpers';
import {tableFilter} from 'src/helpers/filter-helpers';
import {dossierChipStyle, offerChipStyle} from 'src/helpers/chip-helpers';
import {MY_DOSSIERS} from 'src/data/queries/DOSSIER';
import {DOSSIER_FILE, OFFER_FILE} from 'src/data/queries/FILE';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {useRoute} from 'vue-router';
import WarningDialog from 'components/dialogs/WarningDialog.vue';

const $q: QVueGlobals = useQuasar()
const $routerService: RouterService|undefined = inject('$routerService')
const route = useRoute()

// Employee ID from route (if any), only relevant if going from company -> employee view
const employeeUuid = route.query.eid

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
  { name: 'latest_change', label: i18n.global.t('employee_dashboard.latest_change'), field: 'latest_change', sortable: true, align: 'center' },
  { name: 'customer', label: i18n.global.t('employee_dashboard.customer'), field: 'customer', sortable: true, align: 'center' },
  { name: 'institute', label: i18n.global.t('employee_dashboard.institute'), field: 'institute', sortable: true, align: 'center' },
  { name: 'location', label: i18n.global.t('employee_dashboard.location'), field: 'location', sortable: true, align: 'center' },
  { name: 'mortgage_amount', label: i18n.global.t('employee_dashboard.mortgage_amount'), field: 'mortgage_amount', sortable: true, align: 'center' },
  { name: 'status', label: i18n.global.t('employee_dashboard.status'), field: 'status', sortable: false, align: 'center' },
  { name: 'uploads', label: i18n.global.t('employee_dashboard.uploads'), field: 'uploads', sortable: false, align: 'center' },
  { name: 'offers', label: i18n.global.t('employee_dashboard.offers'), field: 'offers', sortable: false, align: 'center' },
  { name: 'non_arrangeable', label: ' ', field: 'non_arrangeable', sortable: true, align: 'center' },
]


const dossiers = subscribeToQuery(MY_DOSSIERS, employeeUuid ? { employeeUuid } : {}) as Ref<Record<string, Array<Record<string, unknown>>>>
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
 * Shows a dialog where the dossier's files can be downloaded
 * @param {Record<string, unknown>} dossier - a dossier
 * @returns {void} - void
 */
function showDossierDocuments(dossier: Record<string, unknown>): void {
  const files: Record<string, unknown>[] = dossier.documents ?? []

  $q.dialog({
    component: DocumentsDialog,
    componentProps: {
      files,
      dossierUuid: dossier.uuid,
      query: DOSSIER_FILE,
      uploadEnabled: !employeeUuid // If coming from non-employee view, disable upload
    }
  }).onOk(() => {
    // Upload documents
    void uploadDossierDocuments(dossier.uuid)
  })
}

/**
 * Routes to the page where documents can be uploaded for a given dossier
 * @param {string} uuid - dossier UUID
 * @returns {Promise<void>} - done
 */
async function uploadDossierDocuments(uuid) {
  await $routerService?.routeTo(ROUTES.DOSSIER_DOCUMENT_UPLOAD, {did: uuid})
}

/**
 * Shows a dialog where the offer's files can be downloaded
 * @param {Record<string, unknown>} offer - an offer
 * @returns {void} - void
 */
function showOfferDocuments(offer: Record<string, unknown>): void {
  const files = offer.documents ?? []
  $q.dialog({
    component: DocumentsDialog,
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

/**
 * Routes to the page for editing an existing dossier
 * @param {Record<string, unknown>} row - the dossier to edit
 * @returns {void}
 */
function onEditDossier(row: Record<string, unknown>){
  // TODO
  console.log('EDIT', row.uuid)

  // If dossier is not editable, show dialog
  $q.dialog({
    component: WarningDialog,
    componentProps: {
      discardLabel: i18n.global.t('buttons.cancel'),
      description: i18n.global.t('messages.dossier_not_editable')
    }
  })
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
