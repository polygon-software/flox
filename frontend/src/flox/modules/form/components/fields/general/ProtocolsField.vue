<template>
  <LabelWrapper :label="$t('fields.protocols')">
    <q-table
      :rows="fromOldProtocols"
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
    <div class="col-2">
      <q-input
        v-model="dateInput"
        :label="$t('fields.date.date')"
        dense
        outlined
        :rules="[
          (val) =>
            IS_VALID_DATE_STRING(val, 'YYYY-MM-DD') ||
            val === null ||
            $t('errors.invalid_date'),
        ]"
        type="date"
        @change="(val: Date) => (protocolEntry.date = val)"
      />
    </div>
    <div class="col-1 q-pl-sm">
      <q-input
        v-model="articleNumberInput"
        :label="$t('fields.article_number')"
        dense
        outlined
        disable
        @change="(val: string) => (protocolEntry.articleNumber = val)"
      />
    </div>
    <div class="col-2 q-pl-sm">
      <q-input
        v-model="unitInput"
        :label="$t('fields.unit')"
        dense
        outlined
        @change="(val: string) => (protocolEntry.unit = val)"
      />
    </div>
    <div class="col-1 q-pl-sm">
      <q-input
        v-model="amountInput"
        :label="$t('fields.amount')"
        mask="##"
        dense
        outlined
        type="number"
        @change="(val: string) => (protocolEntry.amount = val)"
      />
    </div>
    <div class="col-2 q-pl-sm">
      <q-input
        v-model="priceInput"
        :label="$t('fields.price')"
        dense
        suffix="CHF"
        outlined
        type="number"
        @change="(val: string) => (protocolEntry.price = val)"
      />
    </div>
    <div class="col-2 q-pl-sm">
      <q-input
        v-model="discountInput"
        :label="$t('fields.discount')"
        mask="##"
        dense
        suffix="%"
        outlined
        type="number"
        @change="(val: string) => (protocolEntry.discount = val)"
      />
    </div>
    <div class="col-2 q-pl-sm">
      <q-input
        v-model="sumInput"
        :label="$t('fields.sum')"
        dense
        outlined
        suffix="CHF"
        type="number"
        @change="(val: string) => (protocolEntry.sum = val)"
      />
    </div>
    <div class="col-6">
      <q-input
        v-model="descriptionInput"
        :label="$t('fields.description')"
        dense
        outlined
        type="textarea"
        @change="(val: string) => (protocolEntry.description = val)"
      />
    </div>
    <div class="col-6 q-pl-sm">
      <q-input
        v-model="labelInput"
        :label="$t('fields.label')"
        dense
        outlined
        type="textarea"
        @change="(val: string) => (protocolEntry.label = val)"
      />
    </div>
  </div>
  <q-btn
    :class="`${DEFAULT_BUTTON_CLASS} q-my-md`"
    :style="`${DEFAULT_BUTTON_STYLE}; max-width: 300px;`"
    color="primary"
    :label="$t('buttons.add_protocol')"
    icon="add"
    @click="addProtocol"
  />
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
import { fetchByKey } from 'src/flox/modules/form/helpers/form-helpers';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';
import { formatDate } from 'src/format/date.format';
import { IS_VALID_DATE_STRING } from 'src/flox/modules/form/data/RULES';
import ProtocolEntry from 'src/flox/modules/form/data/types/ProtocolEntry';
import {
  DEFAULT_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from 'src/css/defaultStyles';

const props = withDefaults(
  defineProps<{
    // Used to fetch or store data from/to the store
    stateKey: FormStateKey;
    oldProtocols?: ProtocolEntry[];
  }>(),
  {
    oldProtocols: () => [],
  }
);

const columns: Ref<ColumnInterface<UserEntity>[]> = ref([
  {
    name: 'date',
    label: i18n.global.t('fields.date.date'),
    field: 'date',
    format: (val: string): string => (val ? formatDate(new Date(val)) : '-'),
    align: ColumnAlign.left,
    sortable: true,
  },
  {
    name: 'articleNumber',
    label: i18n.global.t('fields.article_number'),
    field: 'articleNumber',
    align: ColumnAlign.left,
    format: (val: string): string => val ?? '-',
    sortable: false,
  },
  {
    name: 'label',
    label: i18n.global.t('fields.label'),
    field: 'label',
    align: ColumnAlign.left,
    format: (val: string): string => val ?? '-',
    sortable: true,
    style: 'max-width: 180px; white-space: normal;',
  },
  {
    name: 'description',
    label: i18n.global.t('fields.description'),
    field: 'description',
    align: ColumnAlign.left,
    format: (val: string): string => val ?? '-',
    sortable: false,
    style: 'max-width: 180px; white-space: normal;',
  },
  {
    name: 'unit',
    label: i18n.global.t('fields.unit'),
    field: 'unit',
    align: ColumnAlign.left,
    format: (val: string): string => val ?? '-',
    sortable: true,
    // eslint-disable-next-line sonarjs/no-duplicate-string
    style: 'max-width: 150px; white-space: normal;',
  },
  {
    name: 'amount',
    label: i18n.global.t('fields.amount'),
    field: 'amount',
    align: ColumnAlign.left,
    format: (val: string): string => val ?? '-',
    sortable: true,
    style: 'max-width: 150px; white-space: normal;',
  },
  {
    name: 'price',
    label: `${i18n.global.t('fields.price')} CHF`,
    field: 'price',
    align: ColumnAlign.left,
    format: (val: string): string => val ?? '-',
    sortable: true,
    style: 'max-width: 150px; white-space: normal;',
  },
  {
    name: 'discount',
    label: `${i18n.global.t('fields.discount')} (%)`,
    field: 'discount',
    format: (val: string): string => val ?? '-',
    sortable: true,
    style: 'max-width: 150px; white-space: normal;',
  },
  {
    name: 'sum',
    label: `${i18n.global.t('fields.sum')} CHF`,
    field: 'sum',
    format: (val: string): string => val ?? '-',
    sortable: true,
    style: 'max-width: 150px; white-space: normal;',
  },
  {
    name: 'actions',
    label: i18n.global.t('fields.delete'),
    field: 'actions',
    format: (val: string): string => val ?? '-',
    sortable: false,
  },
]);

const dateInput: Ref<string | null> = ref(null);
const articleNumberInput: Ref<string | null> = ref('p');
const labelInput: Ref<string | null> = ref(null);
const descriptionInput: Ref<number | null> = ref(null);
const unitInput: Ref<number | null> = ref(null);
const amountInput: Ref<number | null> = ref(null);
const priceInput: Ref<number | null> = ref(null);
const discountInput: Ref<number | null> = ref(null);
const sumInput: Ref<number | null> = ref(null);

const store = useFormStore();

const protocolEntry: Ref<ProtocolEntry> = ref(
  new ProtocolEntry(null, null, null, null, null, null, null, null, null)
);

const fromOldProtocols: Ref<ProtocolEntry[]> = ref(
  cloneDeep(props.oldProtocols)
);

const protocols = computed(() => {
  return fetchByKey({
    formKey: props.stateKey?.formKey,
    pageKey: 'formData',
    cardKey: 'protocols',
    fieldKey: FIELDS.PROTOCOLS.key,
  }) as ProtocolEntry[] | null;
});

/**
 * Save the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (fromOldProtocols.value && fromOldProtocols.value.length > 0) {
    if (props.stateKey) {
      store.setValue(props.stateKey, fromOldProtocols.value);
    }
  } else if (props.stateKey) {
    store.setValue(props.stateKey, null);
  }
}

/**
 * Deletes a row from the table
 */
function deleteRow(index: number): void {
  fromOldProtocols.value.splice(index, 1);
  saveValue();
}

/**
 * Checks whether protocolEntry has no null values
 */
function isProtocolEntryValid(): boolean {
  // Add any checks here in case a field is required
  return true;
}

/**
 * Sets all values of inputs to null
 */
function setValuesToNull(): void {
  protocolEntry.value = new ProtocolEntry(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  dateInput.value = null;
  sumInput.value = null;
  articleNumberInput.value = 'p';
  labelInput.value = null;
  descriptionInput.value = null;
  unitInput.value = null;
  amountInput.value = null;
  priceInput.value = null;
  discountInput.value = null;
  sumInput.value = null;
}

/**
 * Add protocol to the store so that it appears in the table and that it can be put into the query later
 */
function addProtocol(): void {
  if (isProtocolEntryValid()) {
    fromOldProtocols.value.push(protocolEntry.value);
    saveValue();
    setValuesToNull();
  }
}

/**
 *  Set protocols in table when component is mounted
 *  @returns {void} - done
 */
onBeforeMount(() => {
  if (protocols.value) {
    fromOldProtocols.value = protocols.value;
  }
});
</script>
