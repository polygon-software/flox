<template>
  <LabelWrapper :label="$t('fields.time_recording')">
    <q-table
      :rows="timeRecordings"
      :columns="columns"
      flat
      bordered
      dense
      :rows-per-page-options="[0]"
      hide-pagination
    >
      <!-- Action buttons -->
      <template #body-cell-actions="_props">
        <q-td :props="_props">
          <q-btn
            dense
            unelevated
            icon="delete"
            text-color="secondary"
            @click="deleteRow(_props.rowIndex)"
          >
            <q-tooltip>
              {{ $t('buttons.delete') }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </LabelWrapper>
  <div class="q-mx-xs q-mt-md q-mb-lg row justify-between">
    <div class="col-6">
      <q-input
        v-model="taskTypeInput"
        :label="$t('fields.task_type')"
        dense
        outlined
        @change="addTaskType"
      />
    </div>
    <div class="col-3 q-pl-sm">
      <q-input
        v-model="durationInput"
        :label="$t('fields.duration')"
        dense
        outlined
        suffix="h"
        type="number"
        @change="addDuration"
      />
    </div>
    <div class="col-3 q-pl-sm">
      <q-input
        v-model="discountInput"
        :label="$t('fields.discount')"
        dense
        outlined
        type="number"
        suffix="%"
        @change="addDiscount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Ref,
  ref,
  withDefaults,
  defineProps,
  computed,
  onBeforeMount,
} from 'vue';
import { cloneDeep } from 'lodash-es';

import { ColumnAlign, ColumnInterface } from 'components/tables/useDataTable';
import UserEntity from 'src/flox/modules/auth/entities/user.entity';
import { i18n } from 'boot/i18n';
import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';
import { FormStateKey, useFormStore } from 'src/flox/modules/form/stores/form';
import TimeRecordingEntry from 'src/flox/modules/form/data/types/TimeRecordingEntry';
import { fetchByKey } from 'src/flox/modules/form/helpers/form-helpers';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';

const props = withDefaults(
  defineProps<{
    // Used to fetch or store data from/to the store
    stateKey: FormStateKey;
    oldTimeRecordings?: TimeRecordingEntry[];
  }>(),
  {
    oldTimeRecordings: () => [],
  }
);

const store = useFormStore();
const columns: Ref<ColumnInterface<UserEntity>[]> = ref([
  {
    name: 'name',
    label: i18n.global.t('fields.task_type'),
    field: 'name',
    align: ColumnAlign.left,
    sortable: false,
  },
  {
    name: 'timeAmount',
    label: `${i18n.global.t('fields.duration')} (h)`,
    field: 'timeAmount',
    align: ColumnAlign.left,
    sortable: true,
  },
  {
    name: 'discount',
    label: `${i18n.global.t('fields.discount')} (%)`,
    field: 'discount',
    sortable: true,
  },
  {
    name: 'actions',
    label: i18n.global.t('fields.delete'),
    field: 'actions',
    sortable: false,
  },
]);

const taskTypeInput: Ref<string | null> = ref(null);
const durationInput: Ref<string | null> = ref(null);
const discountInput: Ref<number | null> = ref(null);

const timeRecordingEntry: Ref<TimeRecordingEntry> = ref(
  new TimeRecordingEntry(null, null, null)
);

const timeRecordings: Ref<TimeRecordingEntry[]> = ref(
  cloneDeep(props.oldTimeRecordings)
);

const recordings = computed(() => {
  return fetchByKey({
    formKey: props.stateKey?.formKey,
    pageKey: 'formData',
    cardKey: 'productsAndTimeRecording',
    fieldKey: FIELDS.TIME_RECORDINGS.key,
  }) as TimeRecordingEntry[] | null;
});

/**
 * Save the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (timeRecordings.value && timeRecordings.value.length > 0) {
    if (props.stateKey) {
      store.setValue(props.stateKey, timeRecordings.value);
    }
  } else if (props.stateKey) {
    store.setValue(props.stateKey, null);
  }
}

/**
 * Deletes a row from the table
 */
function deleteRow(index: number): void {
  timeRecordings.value.splice(index, 1);
  saveValue();
}

/**
 * Checks whether timeRecordingEntry has no null values
 */
function isTimeRecordingValid(): boolean {
  return (
    !!timeRecordingEntry.value.name &&
    !!timeRecordingEntry.value.timeAmount &&
    !!timeRecordingEntry.value.discount
  );
}

/**
 * Sets all values of inputs and timeRecordingEntry to null
 */
function setValuesToNull(): void {
  timeRecordingEntry.value = new TimeRecordingEntry(null, null, null);
  taskTypeInput.value = null;
  durationInput.value = null;
  discountInput.value = null;
}

/**
 * Adds a value to the taskType array
 * @param {string} val - the value to add
 * @returns {void}
 */
function addTaskType(val: string): void {
  timeRecordingEntry.value.name = val;

  if (isTimeRecordingValid()) {
    timeRecordings.value.push(timeRecordingEntry.value);
    saveValue();
    setValuesToNull();
  }
}

/**
 * Adds a value to the duration array
 * @param {number} val - the value to add
 * @returns {void}
 */
function addDuration(val: number): void {
  timeRecordingEntry.value.timeAmount = Number(val);

  if (isTimeRecordingValid()) {
    timeRecordings.value.push(timeRecordingEntry.value);
    saveValue();
    setValuesToNull();
  }
}

/**
 * Adds a value to the discount array
 * @param {number} val - the value to add
 * @returns {void}
 */
function addDiscount(val: number): void {
  timeRecordingEntry.value.discount = Number(val);
  if (isTimeRecordingValid()) {
    timeRecordings.value.push(timeRecordingEntry.value);
    saveValue();
    setValuesToNull();
  }
}

/**
 *  Set time recordings in table when component is mounted
 *  @returns {void} - done
 */
onBeforeMount(() => {
  if (recordings.value) {
    timeRecordings.value = recordings.value;
  }
});
</script>
