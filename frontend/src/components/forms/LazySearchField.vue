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
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref } from 'vue';
import { QSelectProps } from 'quasar';

import { executeQuery, QueryObject } from 'src/apollo/query';
import { BaseEntity } from 'src/flox/core/base-entity/entities/BaseEntity';
import CountQuery from 'src/flox/modules/interfaces/entities/count.entity';

const props = withDefaults(
  defineProps<{
    modelValue: BaseEntity[];
    label: string;
    optionsLabel: string;
    query: QueryObject;
    selectProps: QSelectProps;
  }>(),
  {
    selectProps: () => ({}),
  }
);

const emit = defineEmits<{
  (e: 'update:model-value', selected: BaseEntity[]): void;
}>();

const options: Ref<BaseEntity[]> = ref([]);

async function filterFn(val, update, abort) {
  const { data } = await executeQuery<CountQuery<BaseEntity>>(props.query, {
    skip: 0,
    take: 5,
    filter: val,
    sortBy: 'uuid',
    descending: false,
  });
  update(() => {
    options.value = data.data;
  });
}
</script>

<style scoped></style>
