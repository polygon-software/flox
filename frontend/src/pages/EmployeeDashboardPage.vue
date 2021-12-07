<template>
  <q-page class="flex flex-center">
    <q-card
      class="square q-pa-md q-ma-md"
      style="width: 800px"
    >
        <p
          class="q-ma-md col text-center"
          style="font-size: x-large"
        >
          {{ $t('employee_dashboard.title') }}
        </p>
        <p class="q-ma-md col text-center" style="display: flex; justify-content: space-between; align-items: baseline">
          {{ $t('employee_dashboard.title2') }}
          <q-input
            v-model="search_employee"
            color="purple-12"
            :label="$t('employee_dashboard.search')"
            type="text"
            @change="searchEmployee"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            class="q-ma-md"
            :label="$t('employee_dashboard.new_assignment')"
            color="primary"
            icon="add"
            @click="newAssignment"
          />
        </p>
      <p class="q-ma-md col text-center">
        <!-- Employee Overview -->
        <CustomerTable/>
      </p>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {i18n} from 'boot/i18n';
import CustomerTable from 'components/tables/CustomerTable.vue';
const emit = defineEmits(['change'])

const search_employee = ref('')

function searchEmployee(){
  emit('change', {
    search_employee: search_employee.value,
  })
}

// TODO: replace with real data
const customers = ref([
  {
    name: 'Joel Barmettler',
  },
  {
    name: 'Marius Högger',
  },
  {
    name: 'Franck Huber',
  },
  {
    name: 'Daniel Gächter',
  },
  {
    name: 'David Wyss',
  },
  {
    name: 'Michèle Fundneider',
  },
  {
    name: 'Ramize Abdili',
  },
  {
    name: 'Elexa Heggli',
  },
])
</script>
