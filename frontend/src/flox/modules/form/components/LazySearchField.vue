<template>
  <q-select
    v-bind="selectProps"
    :model-value="modelValue"
    outlined
    multiple
    dense
    use-input
    use-chips
    fill-input
    input-debounce="250"
    :options="options"
    :option-label="optionsLabel"
    @update:model-value="emit('update:model-value', $event)"
    @filter="filterFn"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ $t('general.no_results') }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { QSelectProps } from 'quasar';

import { executeQuery, QueryObject } from 'src/apollo/query';
import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import CountQuery from 'src/flox/modules/interfaces/entities/count.entity';

/**
 * The lazy search field is a generic input field that searches items
 * in the databased based onthe input and shows them as selections.
 * This item is useful to let the user search for database entities and select
 * one or more of them.
 */
const props = withDefaults(
  defineProps<{
    modelValue: BaseEntity[];
    optionsLabel: ((option: string | any) => string) | string;
    query: QueryObject;
    selectProps?: Omit<QSelectProps, 'modelValue'>;
  }>(),
  {
    selectProps: () => ({}),
  }
);

const emit = defineEmits<{
  (e: 'update:model-value', selected: BaseEntity[]): void;
}>();

const options: Ref<BaseEntity[]> = ref([]);

/**
 * Filter function that dynamically calls backend for new data depending on input
 *
 * @param userInputValue - value that the user inputted
 * @param update - function that updates field options
 */
async function filterFn(
  userInputValue: string,
  update: (cbk: () => void) => void
): Promise<void> {
  const { data } = await executeQuery<CountQuery<BaseEntity>>(props.query, {
    skip: 0,
    take: 5,
    filter: userInputValue,
    sortBy: 'uuid',
    descending: false,
  });
  update(() => {
    options.value = data.data;
  });
}
</script>
