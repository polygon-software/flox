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
  <div class="q-mx-xs q-mt-md q-mb-lg row justify-between">
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
import ArticleNumberEntry from 'src/flox/modules/form/data/types/ArticleNumberEntry';
import { fetchByKey } from 'src/flox/modules/form/helpers/form-helpers';
import { FIELDS } from 'src/flox/modules/form/data/FIELDS';

const props = withDefaults(
  defineProps<{
    // Used to fetch or store data from/to the store
    stateKey: FormStateKey;
    oldArticleNumbers?: ArticleNumberEntry[];
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
    name: 'amount',
    label: i18n.global.t('fields.count'),
    field: 'amount',
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

const store = useFormStore();

const articleNumberEntry: Ref<ArticleNumberEntry> = ref(
  new ArticleNumberEntry(null, null, null, null)
);

const articleNumbers: Ref<ArticleNumberEntry[]> = ref(
  cloneDeep(props.oldArticleNumbers)
);

const articles = computed(() => {
  return fetchByKey({
    formKey: props.stateKey?.formKey,
    pageKey: 'formData',
    cardKey: 'productsAndTimeRecording',
    fieldKey: FIELDS.ARTICLE_NUMBERS.key,
  }) as ArticleNumberEntry[] | null;
});

/**
 * Save the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (articleNumbers.value && articleNumbers.value.length > 0) {
    if (props.stateKey) {
      store.setValue(props.stateKey, articleNumbers.value);
    }
  } else if (props.stateKey) {
    store.setValue(props.stateKey, null);
  }
}

/**
 * Deletes a row from the table
 */
function deleteRow(index: number): void {
  articleNumbers.value.splice(index, 1);
  saveValue();
}

/**
 * Checks whether articleNumberEntry has no null values
 */
function isArticleNumberEntryValid(): boolean {
  return (
    !!articleNumberEntry.value.articleNumber &&
    !!articleNumberEntry.value.manufacturerNumber &&
    !!articleNumberEntry.value.amount &&
    !!articleNumberEntry.value.discount
  );
}

/**
 * Sets all values of inputs and articleNumberEntry to null
 */
function setValuesToNull(): void {
  articleNumberEntry.value = new ArticleNumberEntry(null, null, null, null);
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
    saveValue();
    setValuesToNull();
  }
}

/**
 * Adds a value to the manufacturerNumbers array
 * @param {number} val - the value to add
 * @returns {void}
 */
function addManufacturerNumber(val: string): void {
  articleNumberEntry.value.manufacturerNumber = val;

  if (isArticleNumberEntryValid()) {
    articleNumbers.value.push(articleNumberEntry.value);
    saveValue();
    setValuesToNull();
  }
}

/**
 * Adds a value to the count array
 * @param {number} val - the value to add
 * @returns {void}
 */
function addCount(val: number): void {
  articleNumberEntry.value.amount = Number(val);
  if (isArticleNumberEntryValid()) {
    articleNumbers.value.push(articleNumberEntry.value);
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
  articleNumberEntry.value.discount = Number(val);
  if (isArticleNumberEntryValid()) {
    articleNumbers.value.push(articleNumberEntry.value);
    saveValue();
    setValuesToNull();
  }
}

/**
 *  Set article numbers in table when component is mounted
 *  @returns {void} - done
 */
onBeforeMount(() => {
  if (articles.value) {
    articleNumbers.value = articles.value;
  }
});
</script>
