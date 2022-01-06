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

        <q-table
          :rows="rows"
          :columns="columns"
          row-key="key"
          :rows-per-page-options="[10,20, 100]"
          flat
          bordered
          style="margin-top: 24px"
        >
          <template #body="_props">

          <q-tr
            :props="_props"
            class="q-ma-none q-pa-none"
            style="cursor: pointer"
          >
            <q-td key="label" :props="_props">
              <p>
                {{_props.row.label}}:
              </p>
            </q-td>
            <q-td key="value" :props="_props">
              <div class="row">
                <p>
                  {{_props.row.value.toLocaleString()}}$
                </p>
                <p class="text-grey-5" style="padding-left: 6px">
                  ({{_props.row.change > 0 ? '+' + _props.row.change.toLocaleString(): _props.row.change.toLocaleString()}}$)
                </p>
              </div>
            </q-td>
            <q-td key="change" :props="_props">
              <q-icon
                :name="getChangeIcon(_props.row.value, _props.row.change).icon"
                :color="getChangeIcon(_props.row.value, _props.row.change).color"
                size="32px"
              />
            </q-td>
          </q-tr>
          </template>

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
  { name: 'change', label: 'Trend', field: 'change', sortable: false, align: 'center' },
]

const rows = [
  {
    key: 'total_earnings',
    label: 'Gesamteinnahmen',
    value: 2000000,
    change: 50000
  },
  {
    key: 'total_credit',
    label: 'Guthabenvolumen',
    value: 500000,
    change: 2100
  },
  {
    key: 'new_credit',
    label: 'Neue Einzahlungen',
    value: 2300,
    change: -200
  },
]

const tabs = [
  'all_time',
  'year',
  'quarter',
  'month',
  'week',
  'day'
]

/**
 * Gets color & icon for a value change
 * @param {number} value - new value
 * @param {number} change - value change since last time epoch
 * @returns {Record<string, string>} - containing icon and color
 */
function getChangeIcon(value: number, change: number): Record<string, string>{

  // Threshold: if change is <2%, show flat trend
  const isSignificantChange = Math.abs(change) > Math.abs(value * 0.02)

  // Neutral
  if(!isSignificantChange){
    return {
      icon: 'trending_flat',
      color: 'gray',
    }
  }

  // Positive
  if(change > 0){
    return {
      icon: 'trending_up',
      color: 'positive'
    }
  }

  // Negative
  return {
    icon: 'trending_down',
    color: 'negative'
  }
}
</script>
