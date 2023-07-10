<template>
  <LabelWrapper>
    <q-input
      v-model="totalAmont"
      :label="$t('fields.total_amount')"
      outlined
      dense
      disable
    />
  </LabelWrapper>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';

import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';
import { FormStateKey } from 'src/flox/modules/form/stores/form';
import { fetchByKey } from 'src/flox/modules/form/helpers/form-helpers';
import ArticleNumberEntry from 'src/flox/modules/form/data/types/ArticleNumberEntry';

const props = withDefaults(
  defineProps<{
    // Used to fetch or store data from/to the store
    stateKey: FormStateKey;
  }>(),
  {}
);

// Total amount of all costs
const totalAmont = computed(() => {
  const articlesKey = {
    ...props.stateKey,
    cardKey: 'productsAndTimeRecording',
    fieldKey: 'articleNumbers',
  };

  const articles =
    (fetchByKey(articlesKey) as ArticleNumberEntry[]) || undefined;

  // For each article, add the price reduced by the discount to the sum
  if (articles) {
    const sum = articles.reduce((accumulator, article) => {
      if (article.price && article.discount) {
        return accumulator + article.price * ((100 - article.discount) / 100);
      }
      return accumulator;
    }, 0);

    // Since the amount will be in CHF, we round up to the next multiple of 0.05
    return (Math.ceil(sum * 20) / 20).toFixed(2);
  }
  return 0;
});
</script>
