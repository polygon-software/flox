<template>
  <q-page class="flex flex-center">
    <q-table
      :title="$tc('application', 2)"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="state" :props="props">
            {{ getState(props.row.companyData) }}
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              v-if="isAction(props.row.companyData)"
              color="primary"
              :label="props.row.companyData.document_upload_enabled ? $t('dashboards.unlock_account') : $t('dashboards.enable_upload')"
              @click="props.row.companyData.document_upload_enabled ? unlockAccount() : enableUpload(props.row.companyData)"
            />
            <div v-else>
              {{ $t('documents.documents_missing') }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { i18n } from 'boot/i18n';
import SignUpApplicationDialog from 'src/components/dialogs/SignUpApplicationDialog.vue'
import { Company } from 'src/data/types/Company'
import { useQuasar } from 'quasar'
import {Address} from 'src/data/types/Address';

const $q = useQuasar()

// Mock data
const data1 = new Company(
  'Polygon Software',
  'DE',
  'Polygon2ElectricBoogaloo',
  '123Abc',
  'Marino Schneider',
  new Address('Musterstrasse', '1', 'Zürich', '8000'),
  new Address('Thurgauerstrasse', '117', 'Opfikon', '8152'),
  '078 456 23 10',
  'marino.schneider@polygon-software.ch',
  true,
  false,
  []
)

// Mock data
const data2 = new Company(
  'Roche',
  'FR',
  'BlubbiBlubbBlubb',
  'Abc123',
  'Jane Doe',
  new Address('Strassenstrasse', '1', 'Basel', '4000'),
  new Address('Wegweg', '25', 'Muttenz', '4132'),
  '044 256 23 56',
  'jane.derp@roche.ch',
  true,
  true,
  ['Hello.jpg', 'World.pdf', 'Blubb.pdf']
)

// Mock data
const data3 = new Company(
  'Roche',
  'FR',
  'BlubbiBlubbBlubb',
  'Abc123',
  'Jane Doe',
  new Address('Strassenstrasse', '1', 'Basel', '4000'),
  new Address('Wegweg', '25', 'Muttenz', '4132'),
  '044 256 23 56',
  'jane.derp@roche.ch',
  true,
  true,
  []
)

const rows = ref([
  {
    name: 'Antrag 1',
    companyData: data1,
  },
  {
    name: 'Antrag 2',
    companyData: data2,
  },
  {
    name: 'Antrag 3',
    companyData: data3,
  },
])

const columns = [
  {name: 'name', required: true, label: i18n.global.t('dashboards.application'), align: 'left', field: 'name', sortable: true},
  {name: 'state', required: true, label: i18n.global.t('dashboards.state'), align: 'left', field: 'state', sortable: true},
  {name: 'action', required: true, label: i18n.global.t('dashboards.action'), align: 'left', field: 'action', sortable: true}
]

/**
 * Opens the dialog to enable the file upload
 */
function enableUpload(companyData: Company) {
  $q.dialog({
    title: 'SignUpApplication',
    component: SignUpApplicationDialog,
    componentProps: {
      companyData: companyData
    }
  })
}

/**
 * Unlocks a account
 */
function unlockAccount() {
  console.log('Unlock account')
}


/**
 * Determines if an action button has to be rendered
 * @param {Company} companyData
 */
function isAction(companyData: Company): boolean {
  if (companyData.document_upload_enabled) {
    return companyData.documents !== null && companyData.documents.length > 0
  }
  return true
}

/**
* Returns the state of the application.
* @param {Company} companyData
 */
function getState(companyData: Company): string {
  if (companyData.document_upload_enabled) {
    if (companyData.documents === null || companyData.documents.length === 0) {
      return i18n.global.t('documents.documents_missing')
    }
    return i18n.global.t('documents.documents_available')
  }
  return i18n.global.t('general.new')
}
</script>
