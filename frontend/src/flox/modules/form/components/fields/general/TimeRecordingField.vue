<template>
  <div class="q-mb-md text-left">
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
      <!-- Task type input -->
      <div class="col-6">
        <q-input
          v-model="taskTypeInput"
          :label="$t('fields.task_type')"
          dense
          outlined
          @change="(val: string) => timeRecordingEntry.name = val"
        />
      </div>

      <!-- Date input -->
      <div class="col-3 q-pl-sm">
        <q-input
          v-model="durationInput"
          :label="$t('fields.duration')"
          dense
          outlined
          suffix="h"
          type="number"
          @change="(val: string) => timeRecordingEntry.timeAmount = parseFloat(val)"
        />
      </div>

      <!-- Discount input -->
      <div class="col-3 q-pl-sm">
        <q-input
          v-model="discountInput"
          :label="$t('fields.discount')"
          dense
          mask="##.#"
          suffix="%"
          outlined
          @change="(val: string) => timeRecordingEntry.discount = parseFloat(val)"
        />
      </div>
    </div>

    <!-- Add expense button -->
    <q-btn
      :class="`${DEFAULT_BUTTON_CLASS} q-my-md`"
      :style="`${DEFAULT_BUTTON_STYLE}; max-width: 300px;`"
      color="primary"
      :label="$t('buttons.add_expense')"
      icon="add"
      @click="addExpense"
    />
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
import {
  DEFAULT_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from 'src/css/defaultStyles';

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
 * Sets all values of inputs and timeRecordingEntry to null
 */
function setValuesToNull(): void {
  timeRecordingEntry.value = new TimeRecordingEntry(null, null, null);
  taskTypeInput.value = null;
  durationInput.value = null;
  discountInput.value = null;
}

/**
 * Add expense to the store so that it appears in the table and that it can be put into the query later
 */
function addExpense(): void {
  timeRecordings.value.push(timeRecordingEntry.value);
  saveValue();
  setValuesToNull();
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
