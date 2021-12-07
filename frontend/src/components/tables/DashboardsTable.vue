<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      table-header-class="bg-grey-2"
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
    />
  </div>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';

const props = defineProps({
  columns: {
    required: true,
    type: Array,
    default: () => [],
  },
  rows: {
    required: true,
    type: Array,
    default: () => [],
  },
  title: {
    required: false,
    type: String,
    default: '',
  }
})

</script>
