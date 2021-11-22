<template>
  <q-table
    :title="$tc('application', 2)"
    :rows="rows"
    :columns="columns"
    row-key="name"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="state" :props="props">
          <q-badge color="green">
            {{ props.row.state }}
          </q-badge>
        </q-td>
        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            :label="props.row.action.label"
            @click="props.row.action.callback"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { i18n } from 'boot/i18n';
import SignUpApplicationDialog from 'src/components/dialogs/SignUpApplicationDialog.vue'


// Mock data
const data = {
  company_name: 'Polygon Software',
  language: 'DE',
  uid: 'Polygon2ElectricBoogaloo',
  person_name: 'Marino Schneider',
  domicile_address: 'Musterstrasse 1, 800 Zürich',
  correspondence_address: 'Thurgauerstrasse 117, 8152 Opfikon',
  phone: '078 456 23 10',
  email: 'marino.schneider@polygon-software.ch',
  branch_structure: true
}

const $q = useQuasar()
import { useQuasar } from 'quasar'
const rows = ref([
  {
    name: 'Antrag 1',
    state: 'Aktiv',
    action: {
      label: '1',
      callback: action,
    }
  },
  {
    name: 'Antrag 2',
    state: 'Inaktiv',
    action: {
      label: '2',
      callback: action,
    }
  },
])

const columns = [
  {name: 'name', required: true, label: i18n.global.t('application'), align: 'left', field: 'name', sortable: true},
  {name: 'state', required: true, label: i18n.global.t('state'), align: 'left', field: 'state', sortable: true},
  {name: 'action', required: true, label: i18n.global.t('action'), align: 'left', field: 'action', sortable: true}
]

function action() {
  $q.dialog({
    title: 'SignUpApplication',
    component: SignUpApplicationDialog,
    componentProps: {
      company_data: data
    }
  })
}


</script>
