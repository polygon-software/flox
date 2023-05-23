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
  <div
    class="q-mx-xs q-mt-md q-mb-lg row justify-between"
    style="max-width: 600px"
  >
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
import { Ref, ref, withDefaults, defineProps } from 'vue';
import { cloneDeep } from 'lodash-es';

import { ColumnAlign, ColumnInterface } from 'components/tables/useDataTable';
import UserEntity from 'src/flox/modules/auth/entities/user.entity';
import { i18n } from 'boot/i18n';
import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';

const props = withDefaults(
  defineProps<{
    oldTimeRecordings?: {
      taskType: string;
      duration: number;
      discount: number;
    }[];
  }>(),
  {
    oldTimeRecordings: () => [],
  }
);

const columns: Ref<ColumnInterface<UserEntity>[]> = ref([
  {
    name: 'taskType',
    label: i18n.global.t('fields.task_type'),
    field: 'taskType',
    align: ColumnAlign.left,
    sortable: false,
  },
  {
    name: 'duration',
    label: `${i18n.global.t('fields.duration')} (h)`,
    field: 'duration',
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

const timeRecordingEntry: Ref<{
  taskType: string | null;
  duration: number | null;
  discount: number | null;
}> = ref({
  taskType: null,
  duration: null,
  discount: null,
});

// TODO: declare type
const timeRecordings: Ref<
  {
    taskType: string | null;
    duration: number | null;
    discount: number | null;
  }[]
> = ref(cloneDeep(props.oldTimeRecordings));

/**
 * Deletes a row from the table
 */
function deleteRow(index: number): void {
  timeRecordings.value.splice(index, 1);
}

/**
 * Checks whether timeRecordingEntry has no null values
 */
function isTimeRecordingValid(): boolean {
  return (
    !!timeRecordingEntry.value.taskType &&
    !!timeRecordingEntry.value.duration &&
    !!timeRecordingEntry.value.discount
  );
}

/**
 * Sets all values of inputs and timeRecordingEntry to null
 */
function setValuesToNull(): void {
  timeRecordingEntry.value = {
    taskType: null,
    duration: null,
    discount: null,
  };
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
  timeRecordingEntry.value.taskType = val;

  if (isTimeRecordingValid()) {
    timeRecordings.value.push(timeRecordingEntry.value);
    setValuesToNull();
  }
}

/**
 * Adds a value to the duration array
 * @param {number} val - the value to add
 * @returns {void}
 */
function addDuration(val: number): void {
  timeRecordingEntry.value.duration = val;

  if (isTimeRecordingValid()) {
    timeRecordings.value.push(timeRecordingEntry.value);
    setValuesToNull();
  }
}

/**
 * Adds a value to the discount array
 * @param {number} val - the value to add
 * @returns {void}
 */
function addDiscount(val: number): void {
  timeRecordingEntry.value.discount = val;
  if (isTimeRecordingValid()) {
    timeRecordings.value.push(timeRecordingEntry.value);
    setValuesToNull();
  }
}
</script>
