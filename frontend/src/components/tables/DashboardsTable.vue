<template>
  <div class="column" style="margin-bottom: 32px">
    <q-table
      table-header-class="bg-grey-2"
      :title="title"
      :rows="rows"
      :columns="columns"
      row-key="uuid"
      :rows-per-page-options="[10,20, 100]"
      v-model:selected="selected"
    >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="date">
          {{ props.row.date }}
        </q-td>
        <q-td key="customer">
          {{ props.row.customer }}
        </q-td>
        <q-td key="institute">
          {{ props.row.institute }}
        </q-td>
        <q-td key="location">
          {{ props.row.location }}
        </q-td>
        <q-td key="mortage_amount">
          {{ props.row.mortage_amount }}
        </q-td>
        <q-td key="status">
          {{ props.row.status }}
          <q-popup-edit
            :auto-save="true"
            :model-value="props.row.status"
            @save="(value) => onUpdate(props.row.status, {name: value})"
            v-slot="scope"
          >
            <q-select
              v-model="scope.value"
              :options="options"
            />
          </q-popup-edit>
        </q-td>
        <q-td key="offers">
          {{ props.row.offers }}
        </q-td>
      </q-tr>
    </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import {ref} from 'vue';

// Selection must be an array
let selected = ref([])

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
  },
  options: {
    required: false,
    type: Array,
    default: () => [],
  }
})

</script>
