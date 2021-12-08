<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      :rows="computedResult"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, Ref} from 'vue';
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {MY_EMPLOYEES} from 'src/data/queries/QUERIES';

const props = defineProps({
  columns: {
    required: true,
    type: Array,
    default: () => [],
  },
})

const queryResult = subscribeToQuery(MY_EMPLOYEES) as Ref<Record<string, Array<Record<string, unknown>>>>

const computedResult = computed(()=>{
  return queryResult.value ?? []
})

</script>
