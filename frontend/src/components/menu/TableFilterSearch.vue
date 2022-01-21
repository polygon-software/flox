<template>
  <div class="row">
    <div class="q-gutter-y-md column" style="min-width: 150px">
    <q-select
      dense
      filled
      clearable
      style="overflow: hidden; text-overflow: ellipsis"
      v-model="dateFilter"
      :options="options"
      :label="$t('dossier.date_filter')"
      @update:model-value="filterSelected"/>
    </div>
    <q-input
      v-model="fromDate"
      type="date"
      :label="$t('general.from')"
      outlined
      dense
      style="margin: 0 10px 0 10px"
      @change="emitValues"
    />
    <q-input
      v-model="toDate"
      type="date"
      :label="$t('general.to')"
      outlined
      dense
      style="margin: 0 10px 0 10px"
      @change="emitValues"
    />

    <!-- Search bar -->
    <q-input
      v-model="search"
      :label="$t('general.search')"
      type="search"
      outlined
      dense
      class="q-mb-md"
      @change="emitValues"
    >
      <template #prepend>
        <q-icon name="search"/>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, Ref, ref} from 'vue';
import {i18n} from "boot/i18n";
import {dateToInputString, getCurrentQuarter} from "src/helpers/date-helpers";

const emit = defineEmits(['change'])
const today = new Date()


const options = [
  {
    key: 'year-to-date',
    label: i18n.global.t('dossier.year_to_date'),
    fromDate: new Date(today.getFullYear(), 0, 1), // January 1st current year
    toDate: today,
  },
  {
    key: 'current-quarter',
    label: i18n.global.t('dossier.current_quarter'),
    fromDate:  getCurrentQuarter()[0],
    toDate: getCurrentQuarter()[1],
  },
  {
    key: 'current-month',
    label: i18n.global.t('dossier.current_month'),
    fromDate:  new Date(today.getFullYear(), today.getMonth(), 1), // 1st current month
    toDate: new Date(today.getFullYear(), today.getMonth()+1, 0), // last current month
  },
  {
    key: 'past-365-days',
    label: i18n.global.t('dossier.past_365_days'),
    fromDate: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()), // a year ago today
    toDate: today,
  },
]


const search = ref('')
const dateFilter : Ref<Record<string, Date|string>|null> =  ref(options[0])
const fromDate = ref(dateToInputString(dateFilter.value?.fromDate as Date))
const toDate = ref(dateToInputString(dateFilter.value?.toDate as Date))

/**
 * Updates from and to date
 * @returns {void}
 */
function filterSelected() {
  fromDate.value = dateToInputString(dateFilter.value?.fromDate as Date)
  toDate.value = dateToInputString(dateFilter.value?.toDate as Date)
}

/**
 * Emits the current state
 * @returns {void}
 */
function emitValues() {
  dateFilter.value = null
  emit('change', {
    search: search.value,
    fromDate: fromDate.value,
    toDate: toDate.value
  })
}

</script>
