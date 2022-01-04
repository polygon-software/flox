<template>
  <q-page
    class="q-pa-lg q-ma-lg">

    <!-- Container for search & adding -->
    <div class="row justify-between q-ma-none q-pb-lg">
      <h5 class="q-ma-none">
        {{ $tc('dashboards.dossier', 2) + ' (' + computedResult.length + ')' }}
      </h5>
      <!-- Search bar -->
      <q-input
        v-model="search"
        dense
        :label="$t('general.search')"
        outlined
        type="search"
        class="q-mb-md"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Dossiers Overview -->
    <div class="column" style="margin-bottom: 32px">
      <q-table
        card-style="border-radius: 8px; background-color: transparent"
        table-header-class="bg-transparent"
        :rows="computedResult"
        :columns="columns"
        row-key="uuid"
        :rows-per-page-options="[10,20, 100]"
        separator="none"
        :filter="search"
        :filter-method="tableFilter"
        flat
      >
        <template #body="_props">
          <q-tr
            :props="_props"
            style="background-color: white; cursor: pointer"
          >
            <q-td key="date" :props="_props">
              {{ formatDate(_props.row.created_at) }}
            </q-td>
            <q-td key="offer_id" :props="_props">
              {{ _props.row.readable_id }}
            </q-td>
            <q-td key="city" :props="_props">
              {{ _props.row.correspondence_address.city }}
            </q-td>
            <q-td key="market_value" :props="_props">
              unknown
            </q-td>
            <q-td key="mortgage" :props="_props">
              {{ _props.row.loan_sum }}
            </q-td>
            <q-td key="b_degree" :props="_props">
              <!-- TODO -->
              -
            </q-td>
            <q-td key="acceptability_of_risks" :props="_props">
              <!-- TODO -->
              -
            </q-td>
            <q-td key="expiration" :props="_props">
              <!-- TODO -->
              -
            </q-td>
            <q-td key="download">
              <q-icon
                v-if="ownOfferForDossier(_props.row)"
                name="download"
                color="primary"
                size="md"
                round
                @click.stop="()=>showAllDocuments(_props.row)"
              />
            </q-td>
            <q-td key="offer_status" :props="_props">
            <!-- Case 1: we have an offer on this dossier -->
              <q-chip
                v-if="ownOfferForDossier(_props.row)"
                text-color="white"
                :style="offerChipStyle(ownOfferForDossier(_props.row).status)"
                :label="$t('offer_status_enum.' + (ownOfferForDossier(_props.row).status))"
              >
                <q-popup-edit
                  v-slot="scope"
                  :auto-save="true"
                  :model-value="ownOfferForDossier(_props.row).status"
                  @save="(value) => onUpdateStatus(_props.row.uuid, ownOfferForDossier(_props.row).uuid, value)"
                >
                  <q-select
                    v-model="scope.value"
                    :option-label="(status)=>$t('offer_status_enum.' + status)"
                    :options="Object.keys(OFFER_STATUS)"
                  />
                </q-popup-edit>
              </q-chip>

              <!-- Case 2: no offer yet: show button to mark interest -->
              <q-chip
                v-else
                color="primary"
                text-color="white"
                :label=" $t('dossier.offer')"
                clickable
                @click="createOfferForDossier(_props.row)"
              />
            </q-td>
          </q-tr>
          <!-- One spacer row per row -->
          <q-tr style="height: 14px"/>
        </template>
      </q-table>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {i18n} from 'boot/i18n';
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import {DOSSIER_FILE, DOSSIERS_BANK, MY_BANK} from 'src/data/queries/QUERIES';
import {computed, inject, ref} from 'vue';
import {tableFilter} from 'src/helpers/filter-helpers';
import {formatDate} from 'src/helpers/format-helpers';
import DownloadDocumentsDialog from 'components/dialogs/DownloadDocumentsDialog.vue';
import UploadOfferDialog from 'components/dialogs/UploadOfferDialog.vue';
import RejectDossierDialog from 'components/dialogs/RejectDossierDialog.vue';
import {QVueGlobals, useQuasar} from 'quasar';
import {offerChipStyle} from 'src/helpers/chip-helpers';
import {CREATE_OFFER, SET_OFFER_STATUS} from 'src/data/mutations/DOSSIER';
import {OFFER_STATUS} from 'src/data/ENUM/ENUM';
import {ErrorService} from 'src/services/ErrorService';
import {showNotification} from 'src/helpers/notification-helpers';

const $q: QVueGlobals = useQuasar()
const $errorService: ErrorService|undefined = inject('$errorService')

const dossiers = subscribeToQuery(DOSSIERS_BANK, {})
const computedResult = computed(()=>{
  return dossiers.value ?? []
})

const search = ref('')

const myBank = subscribeToQuery(MY_BANK, {})

/**
 * Checks whether we have an own offer on a dossier
 * @param {Record<string, unknown>} dossier - the dossier
 * @returns {Record<string, unknown>} - the offer, if any
 */
function ownOfferForDossier(dossier: Record<string, unknown>): Record<string, unknown>|null{
  if(!myBank.value){
    return null;
  }
  const myBankValue = myBank.value as Record<string, string|unknown>
  // Check for missing data
  if([dossier, dossier.offers, myBank.value, myBankValue.uuid].some((val) => val === undefined || val === null)){
    return null;
  }

  const offers = dossier.offers as Record<string, Record<string, string>>[]
  // Search offers for one that is made by own bank
  return offers.find((offer: Record<string, Record<string, string>>) => offer.bank.uuid === myBankValue.uuid) ?? null
}

/**
 * Creates a new offer for a dossier
 * @param {Record<string, unknown>} dossier - the dossier
 * @returns {Promise<void>} - done
 */
async function createOfferForDossier(dossier: Record<string, unknown>){
  if(!myBank.value){
    return null;
  }
  const myBankValue = myBank.value as Record<string, string|unknown>
  // Ensure no missing values
  if(!myBank.value || !dossier || !myBankValue.uuid){
    $errorService?.showErrorDialog(new Error(i18n.global.t('errors.missing_attributes')))
    return
  }

  // Ensure no offer present yet
  if(ownOfferForDossier(dossier)){
    $errorService?.showErrorDialog(new Error(i18n.global.t('errors.offer_already_present')))
    return
  }

  // Create actual offer
  await executeMutation(CREATE_OFFER, {
    bank_uuid: myBankValue.uuid,
    dossier_uuid: dossier.uuid,
    status: OFFER_STATUS.INTERESTED // TODO remove once no mock-data present anymore
  })
}

/**
 * Shows a dialog for downloading any dossier files
 * @param {Dossier} dossier - Dossier to download files from
 * @returns {void}
 */
function showAllDocuments(dossier: Record<string, unknown>) {
  $q.dialog({
    title: 'DownloadDocumentsDialog',
    component: DownloadDocumentsDialog,
    componentProps: {
      files:dossier.documents,
      query: DOSSIER_FILE
    }
  })
}

/**
 * Hanldes offer status update by either changing directly or showing appropriate popup
 * @param {string} dossierUuid - the dossier's UUID
 * @param {string} offerUuid - the offer's UUID
 * @param {OFFER_STATUS} status - new status
 * @returns {Promise<void>} - done
 */
async function onUpdateStatus(dossierUuid: string, offerUuid: string, status: OFFER_STATUS) {
  switch(status){

    // If accepted: prompt Bank to upload offer documents
    case OFFER_STATUS.ACCEPTED:

      $q.dialog({
      title: 'UploadOfferDialog',
      component: UploadOfferDialog,
      persistent: true,
      componentProps:{
        offerUuid,
      }
      }).onOk(() => {
        // Change offer status TODO .then on mutation that uploads files
        void changeOfferStatus(dossierUuid, offerUuid, status)
      })
      break;

    // If retracted: prompt Bank to enter reason
    case OFFER_STATUS.RETRACTED:
      $q.dialog({
        title: 'RejectDossierDialog',
        component: RejectDossierDialog,
        persistent: true
      }).onOk((reason: string) => {
        // TODO save reject reason
        console.log('reject with reason', reason)
        // Change offer status TODO .then on mutation that uploads files
        void changeOfferStatus(dossierUuid, offerUuid, status)
      })
      break;

    // Default case: just change status
    default:
      await changeOfferStatus(dossierUuid, offerUuid, status)
  }
}

/**
 * Changes an offer's status
 * @param {string} dossierUuid - the dossier's UUID
 * @param {string} offerUuid - the offer's UUID
 * @param {OFFER_STATUS} status - new status
 * @returns {Promise<void>} - done
 */
async function changeOfferStatus(dossierUuid: string, offerUuid: string, status: OFFER_STATUS){
  // Change offer status
  await executeMutation(SET_OFFER_STATUS, {
    dossier_uuid: dossierUuid,
    offer_uuid: offerUuid,
    status: status
  }).then(() => {
    showNotification(
      $q,
      i18n.global.t('messages.success'),
      undefined,
      'positive'
    )
  }).catch(() => {
    showNotification(
      $q,
      i18n.global.t('messages.failure'),
      undefined,
      'negative'
    )
  })
}

const columns = [
  {name: 'date', label: i18n.global.t('account_data.date'), field: 'date', sortable: true, align: 'center'},
  {name: 'offer_id', label: i18n.global.t('dashboards.offer_id'), field: 'offer_id', sortable: true, align: 'center'},
  {name: 'city', label: i18n.global.t('account_data.city'), field: 'city', sortable: false, align: 'center'},
  {name: 'market_value', label: i18n.global.t('dashboards.market_value'), field: 'market_value', sortable: true, align: 'center'},
  {name: 'mortgage', label: i18n.global.t('dashboards.mortgage'), field: 'mortgage', sortable: true, align: 'center'},
  {name: 'b_degree', label: i18n.global.t('dashboards.b_degree'), field: 'b_degree', sortable: true, align: 'center'},
  {
    name: 'acceptability_of_risks',
    label: i18n.global.t('dashboards.acceptability_of_risks'),
    field: 'acceptability_of_risks',
    sortable: true,
    align: 'center'
  },
  {name: 'expiration', label: i18n.global.t('dashboards.expiration'), field: 'expiration', sortable: true, align: 'center'},
  {name: 'download', label: ' ', field: 'download', sortable: true, align: 'center'},
  {name: 'offer_status', label: ' ', field: 'offer_status', sortable: true, align: 'center'},
]


</script>
