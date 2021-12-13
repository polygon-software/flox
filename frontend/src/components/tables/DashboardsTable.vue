<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      v-model:selected="selected"
      table-header-class="bg-grey-2"
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
    >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="date">
          {{ props.row.date }}
        </q-td>
        <q-td key="customer">
          {{ props.row.customer }}
        </q-td>
        <q-td key="institute">
          {{ props.row.institute }}
        </q-td>
        <q-td key="location">
          {{ props.row.location }}
        </q-td>
        <q-td key="mortage_amount">
          {{ props.row.mortage_amount }}
        </q-td>
        <q-td key="status" style="padding: 30px; color: white; background-color: #58ACFA; -webkit-background-clip: content-box; background-clip: content-box">
          {{ props.row.status }}
          <q-popup-edit
            v-slot="scope"
            :auto-save="true"
            :model-value="props.row.status"
            @save="(value) => onUpdate(props.row.status, {name: value})"
          >
            <q-select
              v-model="scope.value"
              :options="options"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="uploads">
          {{ props.row.uploads }}
          <q-btn
            :label="$t('employee_dashboard.all_documents')"
            @click="showAllDocuments"
          />
        </q-td>
        <q-td key="offers">
          <q-chip
            v-for="(offer, index) in props.row.offers"
            :key="index"
          >
            {{ offer }}
          </q-chip>
        </q-td>
      </q-tr>
    </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import {ref} from 'vue';
import {executeMutation} from 'src/helpers/data-helpers';
import UploadDocumentsDialog from 'src/components/dialogs/UploadDocumentsDialog.vue';
import {QVueGlobals, useQuasar} from 'quasar';
import {SET_DOSSIER_STATUS} from "src/data/mutations/DOSSIER";

const $q: QVueGlobals = useQuasar()

// Selection must be an array
let selected = ref([])

const props = defineProps({
  columns: {
    required: true,
    type: Array,
    default: () => [],
  },
  rows: {
    required: true,
    type: Array,
    default: () => [],
  },
  title: {
    required: false,
    type: String,
    default: '',
  },
  options: {
    required: false,
    type: Array,
    default: () => [],
  }
})

/**
 * Edits the given user
 * @param {string} status - the user's ID
 * @param {string} variables - the new variables
 */
function onUpdate(status: string, variables: Record<string, unknown>){
  void executeMutation(
    SET_DOSSIER_STATUS,
    {
      //uuid: props.row.uuid,
      status: status,
      ...variables
    }
  )
}

/**
 * Opens the dialog to show all documents and to upload further documents
 */
function showAllDocuments() {
  console.log("halloo")
  $q.dialog({
    title: 'UploadDocumentsDialog',
    component: UploadDocumentsDialog,
  })
}

</script>
