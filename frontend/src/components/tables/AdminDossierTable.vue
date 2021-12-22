<template>
  <div class="column" style="margin-bottom: 32px">
    <div
      class="row justify-between q-ma-none"
    >
      <h6 class="q-ma-none">
        {{ $tc('dashboards.dossier', 2) + ' (' + rows.length + ')' }}
      </h6>

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

    <q-table
      v-model:selected="selected"
      card-style="border-radius: 8px; background-color: transparent"
      table-header-class="bg-transparent"
      color="transparent"
      :rows="rows"
      :columns="columns"
      row-key="uuid"
      :filter="search"
      :rows-per-page-options="[10,20, 100]"
      separator="none"
      flat
    >
      <template #body="props">
        <q-tr
          :props="props"
          style="background-color: white; cursor: pointer"
          @click="()=>onRowClick(props.row)"
        >
          <q-td key="date">
            {{ formatDate(props.row.created_at) }}
          </q-td>
          <q-td key="customer">
            {{ props.row.first_name + " " + props.row.last_name }}
          </q-td>
          <q-td key="institute">
            {{ props.row.original_bank.name }}
          </q-td>
          <q-td key="location">
            {{ props.row.property_address.city }}
          </q-td>
          <q-td key="mortgage_amount">
            {{ props.row.loan_sum }}
          </q-td>
          <q-td key="status">
            <q-chip :style="dossierChipStyle(props.row.status)">
              {{ $t('dossier_status_enum.' + props.row.status) }}
            </q-chip>
          </q-td>
          <q-td key="uploads">
            {{ props.row.uploads }}
            <q-btn
              icon="picture_as_pdf"
              color="primary"
              round
              @click="showAllDocuments"
            />
          </q-td>
          <q-td key="offers">
            <q-chip
              v-for="(offer, index) in props.row.offers"
              :key="index"
              :style="offerChipStyle(offer.status)"
            >
              {{ offer.bank.abbreviation }}
            </q-chip>
          </q-td>
          <q-td key="non-arrangeable">
            <q-icon v-if="props.row.non_arrangeable" name="warning" size="30px" color="red"/>
          </q-td>
        </q-tr>
        <!-- one spacer row per row -->
        <q-tr style="height: 14px"/>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {computed, Ref, ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import UploadDocumentsDialog from 'src/components/dialogs/UploadDocumentsDialog.vue';
import ResetDossierDialog from 'src/components/dialogs/ResetDossierDialog.vue';
import {QVueGlobals, useQuasar} from 'quasar';
import {i18n} from 'boot/i18n';
import {OFFER_STATUS, DOSSIER_STATUS} from 'src/data/ENUM/ENUM';
import {REJECTED_DOSSIERS} from 'src/data/queries/QUERIES';
import {formatDate} from 'src/helpers/format-helpers';
import {showNotification} from 'src/helpers/notification-helpers';

const $q: QVueGlobals = useQuasar()

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
  { name: 'non-arrangeable', label:'', field: 'non-arrangeable', sortable: true, align: 'center' },
]

const search = ref('')

const dossiers = subscribeToQuery(REJECTED_DOSSIERS) as Ref<Record<string, Array<Record<string, unknown>>>>
const rows = computed(()=>{
  return dossiers.value ?? []
})

/**
 * ToDo Fix colors
 * Chip color depending on the status
 * @param {STATUS} status - status of Dossier
 * @returns {string} - style
 */
function offerChipStyle(status: OFFER_STATUS){
  const color = 'color: white; background-color: '
  switch (status) {
    case OFFER_STATUS.INTERESTED:
      return color + '#f0b000;'
    case OFFER_STATUS.IN_PROCESS:
      return color + '#040f85;'
    case OFFER_STATUS.RETRACTED:
      return color + '#c92002;'
    case OFFER_STATUS.ACCEPTED:
      return color + '#16630a;'
  }
  return color + '#000000;'
}

/**
 * ToDo Fix colors
 * Chip color depending on the status
 * @param {STATUS} status - status of Dossier
 * @returns {string} - style
 */
function dossierChipStyle(status: STATUS){
  const color = 'color: white; background-color: '
  switch (status) {
    case DOSSIER_STATUS.OPEN:
      return color + '#58ACFA;'
    case DOSSIER_STATUS.SIGNED:
      return color + '#52130A;'
    case DOSSIER_STATUS.REJECTED:
      return color + '#A82CF0;'
    case DOSSIER_STATUS.SUBMITTED:
      return color + '#4126F9;'
    case DOSSIER_STATUS.OFFERED:
      return color + '#378F23;'
    case DOSSIER_STATUS.COMPLETED:
      return color + '#1FB06C;'
    case DOSSIER_STATUS.IN_PROGRESS:
      return color + '#A22736;'
    case DOSSIER_STATUS.SENT:
      return color + '#F829F3;'
  }
  return color + '#000000;'
}

/**
 * Opens the dialog to show all documents and to upload further documents
 * @returns {void}
 */
function showAllDocuments() {
  $q.dialog({
    title: 'UploadDocumentsDialog',
    component: UploadDocumentsDialog,
  })
}

/**
 * Upon clicking a row, show dialog to re-enable dossier
 * @param {Record<string, unknown>} dossier - dossier that was clicked
 * @returns {void}
 */
function onRowClick(dossier: Record<string, unknown>): void{
  $q.dialog({
    component: ResetDossierDialog,
  }).onOk(() => {
    showNotification(
        $q,
        i18n.global.t('messages.dossier_reset'),
        undefined,
        'positive'
      )
    // // Delete all offers & reset status
    // // executeMutation(DELETE_COMPANY, {uuid: props.company.uuid}).then(() => { TODO
    //   // Show notification
    //   showNotification(
    //     $q,
    //     i18n.global.t('messages.dossier_reset'),
    //     undefined,
    //     'primary'
    //   )
    // }).catch((error)=>{
    //   console.error(error) // Todo Toast
    // })
  })}


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
