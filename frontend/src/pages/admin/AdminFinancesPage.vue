<template>
  <q-page class="flex" style="flex-direction: column">
    <!-- Top row: title -->
    <h6 class="q-ma-md">{{ $t('dashboards.finances') }}</h6>

    <!-- Body: Info cards -->
    <div
      class="column full-height items-start q-pa-md full-width"
      style="padding-right: 32px"
    >
      <!-- Time frame overview -->
      <q-card
        class="q-ma-md"
        flat
        style="width: 100%; border-radius: 20px; border: 1px solid black"
      >
        <h6 class="q-ma-md">{{ $t('finances.overview') }}</h6>

        <!-- Time frame picker -->
        <div class="row">
          <q-tabs
            v-model="selectedTimeframe"
            dense
            class="q-mt-xs text-grey"
            active-color="primary"
            indicator-color="primary"
            narrow-indicator
          >
            <q-tab
              v-for="tab in tabs"
              :key="tab"
              :name="tab"
              :label="$t(`finances.${tab}`)"
            >
            </q-tab>
          </q-tabs>
        </div>

        <q-separator/>

        <q-table
          :rows="rows"
          :columns="columns"
          row-key="uuid"
          :rows-per-page-options="[10,20, 100]"
          flat
          bordered
        >
          <q-tr
            :props="_props"
            class="q-ma-none q-pa-none"
            style="cursor: pointer"
          >
            <q-td key="label" :props="_props">
              {{_props.row.label}}
            </q-td>
            <q-td key="value" :props="_props">
              {{_props.row.value}}
            </q-td>
            <q-td key="change" :props="_props">
              {{_props.row.change}}
            </q-td>
          </q-tr>

        </q-table>
      </q-card>

      <!-- General -->
      <q-card
        class="q-ma-md"
        flat
        style="width: 100%; border-radius: 20px; border: 1px solid black"
      >
        <h6 class="q-ma-md">{{ $t('finances.general') }}</h6>

      </q-card>

    </div>

  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const selectedTimeframe = ref('year')

const columns = [
  { name: 'label', label: 'Kennzahl', field: 'label', sortable: true, align: 'center' },
  { name: 'value', label: 'Wert', field: 'value', sortable: true, align: 'center' },
  { name: 'change', label: 'Change', field: 'change', sortable: true, align: 'center' },
]

const rows = [
  {
    label: 'Gesamteinnahmen',
    value: 2000000,
    change: 30000
  },
  {
    label: 'Guthabenvolumen',
    value: 500000,
    change: 2100
  },
  {
    label: 'Neue Einzahlungen',
    value: 2300,
    change: -200
  },
]

const tabs = [
  'since_beginning',
  'year',
  'quarter',
  'month',
  'week',
  'day'
]
</script>
