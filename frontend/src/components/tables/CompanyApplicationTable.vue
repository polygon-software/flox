<template>
  <q-table
    :title="$tc('dashboards.application', 2)"
    :rows="computedResult"
    :columns="columns"
    row-key="uuid"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="readable_id" :props="props">
          {{ props.row.readable_id }}
        </q-td>
        <q-td key="company_name" :props="props">
          {{ props.row.company_name }}
        </q-td>
        <q-td key="state" :props="props">
          <q-chip
            :label="$t(getState(props.row).label)"
            :color="getState(props.row).color"
            text-color="white"
          />
        </q-td>
        <q-td key="action" :props="props">
          <q-btn
            v-if="isAction(props.row)"
            color="primary"
            :label="props.row.document_upload_enabled ? $t('dashboards.view_documents') : $t('dashboards.enable_upload')"
            @click="props.row.document_upload_enabled ? showDocumentValidationDialog(props.row) : showEnableUploadDialog(props.row)"
          />
          <div v-else>
            {{ $t('errors.documents_missing') }}
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import {computed, inject, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {ALL_COMPANIES} from 'src/data/queries/QUERIES';
import {i18n} from 'boot/i18n';
import {Company} from 'src/data/types/Company';
import SignUpApplicationDialog from 'components/dialogs/SignUpApplicationDialog.vue';
import ValidateDocumentsDialog from 'components/dialogs/ValidateDocumentsDialog.vue';
import {QVueGlobals, useQuasar} from 'quasar';
import {AuthenticationService} from 'src/services/AuthService';
import {ErrorService} from 'src/services/ErrorService';

const $q: QVueGlobals = useQuasar()
const $authService: AuthenticationService|undefined = inject('$authService')
const $errorService: ErrorService|undefined = inject('$errorService')

// ----- Data -----
const columns = [
  { name: 'readable_id', label: 'ID', field: 'readable_id', sortable: false },
  { name: 'company_name', label: i18n.global.t('account_data.company_name'), field: 'company_name', sortable: true },
  {name: 'state', required: true, label: i18n.global.t('dashboards.state'), align: 'left', field: 'state', sortable: true},
  {name: 'action', required: true, label: i18n.global.t('dashboards.action'), align: 'left', field: 'action', sortable: true}
]

const queryResult = subscribeToQuery(ALL_COMPANIES) as Ref<Record<string, Array<Record<string, unknown>>>[]>

const computedResult = computed(()=>{
  const companies = queryResult.value ?? []

  // Filter out completed applications by hiding those that have an account
  // TODO filter out rejected applications
  return companies.filter((company) => {
    return company.cognito_id === undefined || company.cognito_id === null || company.cognito_id.length === 0
  })
})


/**
 * Opens the dialog to enable the file upload
 * @param {Company} company - the company to show the dialog for
 * @returns {void}
 */
function showEnableUploadDialog(company: Company) {
  $q.dialog({
    title: 'SignUpApplication',
    component: SignUpApplicationDialog,
    componentProps: {
      company: company
    }
  })
}

/**
 * Shows a document validation dialog
 * @param {Company} company - the company to show the dialog for
 * @returns {void}
 */
function showDocumentValidationDialog(company: Company) {
  $q.dialog({
    title: 'ValidateDocuments',
    component: ValidateDocumentsDialog,
    componentProps: {
      company: company,
      authService: $authService,
      errorService: $errorService
    }
  })
}


/**
 * Determines if an action button has to be rendered
 * @param {Company} company - company
 * @returns {boolean} - whether there is an action for the state
 */
function isAction(company: Company): boolean {
  if (company.document_upload_enabled) {
    return company.documents !== null && company.documents.length > 0
  }
  return true
}

/**
 * Returns the state of the application.
 * @param {Company} company - the company
 * @returns {Record<string, string>} - the company's state
 */
function getState(company: Company): Record<string, string> {
  if (company.document_upload_enabled) {
    if (company.documents === null || company.documents.length === 0) {
      return {
        label: 'errors.documents_missing',
        color: 'orange'
      }
    }
    return {
      label: 'documents.documents_available',
      color: 'primary'
    }
  }
  return {
    label: 'general.new',
    color: 'positive'
  }
}

</script>
