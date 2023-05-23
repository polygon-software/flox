<template>
  <LabelWrapper :label="$t('fields.article_number')">
    <q-table
      :rows="articleNumbers"
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
    <div class="col-3">
      <q-input
        v-model="articleNumberInput"
        :label="$t('fields.article_number')"
        dense
        outlined
        @change="addArticleNumber"
      />
    </div>
    <div class="col-3 q-pl-sm">
      <q-input
        v-model="manufacturerNumberInput"
        :label="$t('fields.manufacturer_number')"
        dense
        outlined
        @change="addManufacturerNumber"
      />
    </div>
    <div class="col-3 q-pl-sm">
      <q-input
        v-model="countInput"
        :label="$t('fields.count')"
        dense
        outlined
        type="number"
        @change="addCount"
      />
    </div>
    <div class="col-3 q-pl-sm">
      <q-input
        v-model="discountInput"
        :label="$t('fields.discount')"
        mask="##"
        dense
        suffix="%"
        outlined
        type="number"
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
    oldArticleNumbers?: {
      articleNumber: string;
      manufacturerNumber: number;
      count: number;
      discount: number;
    }[];
  }>(),
  {
    oldArticleNumbers: () => [],
  }
);

const columns: Ref<ColumnInterface<UserEntity>[]> = ref([
  {
    name: 'articleNumber',
    label: i18n.global.t('fields.article_number'),
    field: 'articleNumber',
    align: ColumnAlign.left,
    sortable: false,
  },
  {
    name: 'manufacturerNumber',
    label: i18n.global.t('fields.manufacturer_number'),
    field: 'manufacturerNumber',
    align: ColumnAlign.left,
    sortable: true,
  },
  {
    name: 'count',
    label: i18n.global.t('fields.count'),
    field: 'count',
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

const articleNumberInput: Ref<string | null> = ref(null);
const manufacturerNumberInput: Ref<string | null> = ref(null);
const countInput: Ref<number | null> = ref(null);
const discountInput: Ref<number | null> = ref(null);

// TODO: declare type
const articleNumberEntry: Ref<{
  articleNumber: string | null;
  manufacturerNumber: number | null;
  count: number | null;
  discount: number | null;
}> = ref({
  articleNumber: null,
  manufacturerNumber: null,
  count: null,
  discount: null,
});

const articleNumbers: Ref<
  {
    articleNumber: string | null;
    manufacturerNumber: number | null;
    count: number | null;
    discount: number | null;
  }[]
> = ref(cloneDeep(props.oldArticleNumbers));

/**
 * Deletes a row from the table
 */
function deleteRow(index: number): void {
  articleNumbers.value.splice(index, 1);
}

/**
 * Checks whether articleNumberEntry has no null values
 */
function isArticleNumberEntryValid(): boolean {
  return (
    !!articleNumberEntry.value.articleNumber &&
    !!articleNumberEntry.value.manufacturerNumber &&
    !!articleNumberEntry.value.count &&
    !!articleNumberEntry.value.discount
  );
}

/**
 * Sets all values of inputs and articleNumberEntry to null
 */
function setValuesToNull(): void {
  articleNumberEntry.value = {
    articleNumber: null,
    manufacturerNumber: null,
    count: null,
    discount: null,
  };
  articleNumberInput.value = null;
  manufacturerNumberInput.value = null;
  countInput.value = null;
  discountInput.value = null;
}

/**
 * Adds a value to the articleNumbers array
 * @param {string} val - the value to add
 * @returns {void}
 */
function addArticleNumber(val: string): void {
  articleNumberEntry.value.articleNumber = val;

  if (isArticleNumberEntryValid()) {
    articleNumbers.value.push(articleNumberEntry.value);
    setValuesToNull();
  }
}

/**
 * Adds a value to the manufacturerNumbers array
 * @param {number} val - the value to add
 * @returns {void}
 */
function addManufacturerNumber(val: number): void {
  articleNumberEntry.value.manufacturerNumber = val;

  if (isArticleNumberEntryValid()) {
    articleNumbers.value.push(articleNumberEntry.value);
    setValuesToNull();
  }
}

/**
 * Adds a value to the count array
 * @param {number} val - the value to add
 * @returns {void}
 */
function addCount(val: number): void {
  articleNumberEntry.value.count = val;

  if (isArticleNumberEntryValid()) {
    articleNumbers.value.push(articleNumberEntry.value);
    setValuesToNull();
  }
}

/**
 * Adds a value to the discount array
 * @param {number} val - the value to add
 * @returns {void}
 */
function addDiscount(val: number): void {
  articleNumberEntry.value.discount = val;
  if (isArticleNumberEntryValid()) {
    articleNumbers.value.push(articleNumberEntry.value);
    setValuesToNull();
  }
}
</script>
