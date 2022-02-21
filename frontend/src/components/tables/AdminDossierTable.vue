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
      card-style="border-radius: 8px; background-color: transparent"
      table-header-class="bg-transparent"
      color="transparent"
      :rows="rows"
      :columns="columns"
      row-key="uuid"
      :filter="search"
      :filter-method="tableFilter"
      :rows-per-page-options="[10,20, 100]"
      separator="none"
      flat
    >
      <template #body="props">
        <q-tr
          :props="props"
          style="background-color: white; cursor: pointer"
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
            {{ props.row.address.city }}
          </q-td>
          <q-td key="mortgage_amount">
            {{ props.row.mortgage_amount.toLocaleString('de-ch') }}
          </q-td>
          <q-td key="status">
            <q-chip
              :style="dossierChipStyle(props.row.status)"
            >
              {{ $t('dossier_status_enum.' + props.row.status) }}
            </q-chip>
          </q-td>
          <q-td key="uploads">
            <q-icon
              name="download"
              color="primary"
              size="md"
              round
              @click.stop="()=>{showAllDocuments(props.row)}"
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
          <q-td key="non_arrangeable">
            <q-icon v-if="props.row.non_arrangeable" name="warning" size="30px" color="red"/>
          </q-td>
          <q-td key="options">
            <!-- Options for enabled users -->
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
                <!-- Button for permanent (hard) delete -->
                <q-btn
                  :label="$t('admin.delete_permanently')"
                  icon="delete"
                  class="text-black"
                  flat
                  no-caps
                  @click="()=> onDossierDelete(props.row)"
                />
              </div>
            </q-btn-dropdown>
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
import {executeMutation, subscribeToQuery} from 'src/helpers/data-helpers';
import {QVueGlobals, useQuasar} from 'quasar';
import {i18n} from 'boot/i18n';
import {formatDate} from 'src/helpers/format-helpers';
import {showNotification} from 'src/helpers/notification-helpers';
import {DELETE_DOSSIER} from 'src/data/mutations/DOSSIER';
import {tableFilter} from 'src/helpers/filter-helpers';
import {dossierChipStyle, offerChipStyle} from 'src/helpers/chip-helpers';
import DocumentsDialog from 'components/dialogs/DocumentsDialog.vue';
import {DOSSIER_FILE} from 'src/data/queries/FILE';
import {ALL_DOSSIERS} from 'src/data/queries/DOSSIER';
import WarningDialog from 'components/dialogs/WarningDialog.vue';

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
  { name: 'non_arrangeable', label: ' ', field: 'non_arrangeable', sortable: true, align: 'center' },
  { name: 'options', label: ' ', field: 'options', sortable: false, align: 'center' },
]

const search = ref('')

const dossiers = subscribeToQuery(ALL_DOSSIERS) as Ref<Record<string, Array<Record<string, unknown>>>>
const rows = computed(()=>{
  return dossiers.value ?? []
})

/**
 * Shows a dialog for downloading any dossier files
 * @param {Record<string, unknown>} dossier - the selected dossier
 * @returns {void}
 */
function showAllDocuments(dossier: Record<string, unknown>) {
  $q.dialog({
    component: DocumentsDialog,
    componentProps: {
      files: dossier.documents,
      query: DOSSIER_FILE,
      dossierUuid: dossier.uuid
    }
  })
}

/**
 * Upon deleting a dossier, show confirmation dialog
 * @param {Record<string, unknown>} dossier - dossier that was clicked
 * @returns {void}
 */
function onDossierDelete(dossier: Record<string, unknown>): void{
  $q.dialog({
    component: WarningDialog,
    componentProps: {
      description: i18n.global.t('admin.delete_dossier_description'),
      okLabel: i18n.global.t('admin.delete_dossier'),
      discardLabel: i18n.global.t('buttons.cancel'),
      showDiscard: true,
      swapNegative: true
    }
  }).onOk(() => {
    // Delete all offers & reset status
    executeMutation(DELETE_DOSSIER, {uuid: dossier.uuid}).then(() => {
      // Show notification
      showNotification(
        $q,
        i18n.global.t('messages.dossier_deleted'),
        undefined,
        'primary'
      )
    }).catch(()=>{
      showNotification(
        $q,
        i18n.global.t('messages.dossier_delete_failed'),
        undefined,
        'negative'
      )
    })
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
