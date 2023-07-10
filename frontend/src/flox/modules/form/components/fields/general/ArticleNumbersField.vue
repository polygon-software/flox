<template>
  <div class="q-mb-md text-left">
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

    <!-- First field row -->
    <div class="q-mx-xs q-my-md row justify-between">
      <div class="col-4" style="position: relative">
        <!-- Article number input -->
        <q-input
          v-model="articleNumberInput"
          :label="$t('fields.article_number')"
          dense
          outlined
          debounce="500"
        >
          <!-- Used to clear the suggestions -->
          <template #append>
            <q-icon
              v-if="articleSuggestions.length > 0"
              name="close"
              style="cursor: pointer"
              @click="articleSuggestions = []"
            />
          </template>
        </q-input>

        <!--- Article suggestions -->
        <div v-if="articleSuggestions.length > 0" class="article-suggestions">
          <q-list bordered separator>
            <q-item
              v-for="(article, index) in articleSuggestions"
              :key="index"
              class="q-my-xs"
              clickable
              @click="applySuggestion(article)"
            >
              <q-item-section>
                <q-item-label class="text-left">{{
                  `${article.articleNumber} - ${article.name}`
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <!-- Manufacturer number input -->
      <div class="col-4 q-pl-sm">
        <q-input
          v-model="manufacturerNumberInput"
          :label="$t('fields.manufacturer_number')"
          dense
          outlined
          @change="(val: string) => articleNumberEntry.manufacturerNumber = val"
        />
      </div>

      <!-- Article name input -->
      <div class="col-4 q-pl-sm">
        <q-input
          v-model="nameInput"
          :label="$t('fields.name')"
          dense
          outlined
          @change="(val: string) => articleNumberEntry.name = val"
        />
      </div>
    </div>

    <!-- Second field row -->
    <div class="q-mx-xs q-mb-md row justify-between">
      <!-- Description input -->
      <div class="col-3">
        <q-input
          v-model="descriptionInput"
          :label="$t('fields.description')"
          dense
          outlined
          @change="(val: string) => articleNumberEntry.description = val"
        />
      </div>

      <!-- Amount input -->
      <div class="col-3 q-pl-sm">
        <q-input
          v-model="amountInput"
          :label="$t('fields.amount')"
          dense
          outlined
          reverse-fill-mask
          mask="#"
          @change="(val: string) => articleNumberEntry.amount = parseInt(val, 10)"
        />
      </div>

      <!-- Price input -->
      <div class="col-3 q-pl-sm">
        <q-input
          v-model="priceInput"
          :label="$t('fields.price')"
          dense
          outlined
          reverse-fill-mask
          fill-mask="0"
          mask="#.##"
          suffix="CHF"
          @change="(val: string) => articleNumberEntry.price = parseFloat(val)"
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
          @change="(val: string) => articleNumberEntry.discount = parseFloat(val)"
        />
      </div>
    </div>

    <!-- Add article button -->
    <q-btn
      :class="`${DEFAULT_BUTTON_CLASS} q-my-md`"
      :style="`${DEFAULT_BUTTON_STYLE}; max-width: 300px;`"
      color="primary"
      :label="$t('buttons.add_article')"
      icon="add"
      @click="addArticle"
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
  watch,
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
import getArticleSuggestions from 'src/helpers/query-helper';
import ArticleSuggestionEntity from 'src/data/articleSuggestion/entites/articleSuggestionEntity';
import {
  DEFAULT_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from 'src/css/defaultStyles';

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
    name: 'name',
    label: i18n.global.t('fields.name'),
    field: 'name',
    align: ColumnAlign.left,
    sortable: true,
  },
  {
    name: 'description',
    label: i18n.global.t('fields.description'),
    field: 'description',
    align: ColumnAlign.left,
    sortable: true,
  },
  {
    name: 'price',
    label: i18n.global.t('fields.price'),
    field: 'price',
    align: ColumnAlign.left,
    sortable: true,
  },
  {
    name: 'amount',
    label: i18n.global.t('fields.amount'),
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
const nameInput: Ref<string | null> = ref(null);
const descriptionInput: Ref<string | null> = ref(null);
const amountInput: Ref<number | null> = ref(null);
const priceInput: Ref<number | null> = ref(null);
const discountInput: Ref<number | null> = ref(null);

const selectedArticleNumber: Ref<string | null> = ref(null);

const store = useFormStore();

const articleNumberEntry: Ref<ArticleNumberEntry> = ref(
  new ArticleNumberEntry(null, null, null, null, null, null, null)
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

const articleSuggestions: Ref<ArticleSuggestionEntity[]> = ref([]);

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
 * Sets all values of inputs and articleNumberEntry to null
 */
function setValuesToNull(): void {
  articleNumberEntry.value = new ArticleNumberEntry(
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  articleNumberInput.value = null;
  manufacturerNumberInput.value = null;
  nameInput.value = null;
  descriptionInput.value = null;
  amountInput.value = null;
  priceInput.value = null;
  discountInput.value = null;
}

/**
 * Fetches article suggestions for the given string. It will only return
 * suggestions if there are 50 or less.
 *
 * @param val - The entered article number
 * @returns The found article suggestions
 */
async function fetchArticleSuggestions(
  val: string
): Promise<ArticleSuggestionEntity[]> {
  return getArticleSuggestions(val);
}

/**
 * Used so that the debounce function can be used on keyup, quasar somehow does not
 * react to the event (only @change).
 */
watch(
  () => articleNumberInput.value,
  async (val) => {
    if (val && !selectedArticleNumber.value) {
      if (val.length >= 2) {
        articleSuggestions.value = await fetchArticleSuggestions(val);
      }
      articleNumberEntry.value.articleNumber = val;
    }
    selectedArticleNumber.value = null;
  }
);

/**
 * Adds the values from an article suggestion into the input fields.
 * @param article - The article suggestion
 * @returns void
 */
function applySuggestion(article: ArticleSuggestionEntity): void {
  selectedArticleNumber.value = article.articleNumber ?? null;
  articleNumberInput.value = article.articleNumber ?? null;

  // Manufacturer number
  if (article.manufacturerNumber) {
    manufacturerNumberInput.value = article.manufacturerNumber;
    articleNumberEntry.value.manufacturerNumber = article.manufacturerNumber;
  }

  // Article name
  if (article.name) {
    nameInput.value = article.name;
    articleNumberEntry.value.name = article.name;
  }

  // Article description
  if (article.description) {
    descriptionInput.value = article.description;
    articleNumberEntry.value.description = article.description;
  }

  // Price
  if (article.price) {
    priceInput.value = article.price;
    articleNumberEntry.value.price = article.price;
  }

  // Amount
  if (article.amount) {
    amountInput.value = article.amount;
    articleNumberEntry.value.amount = article.amount;
  }

  // Reset suggestions
  articleSuggestions.value = [];
}

/**
 * Add article to the store so that it appears in the table and that it can be put into the query later
 */
function addArticle(): void {
  articleNumbers.value.push(articleNumberEntry.value);
  saveValue();
  setValuesToNull();
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

<style>
.article-suggestions {
  background: white;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  z-index: 1000;
}
</style>
