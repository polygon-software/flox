<template>
  <q-card
    v-if="company || employee"
    class="full-width q-pa-sm"
    style="margin-bottom: 20px"
    flat
  >
    <q-item-label v-if="company" caption>
      {{ $t('employee_dashboard.organisation_id')}}: {{ company.readable_id }}
    </q-item-label>
    <q-item-label v-if="employee" caption>
      {{ $t('employee_dashboard.employee_id')}}: {{ employee.readable_id }}
    </q-item-label>
  </q-card>
</template>

<script setup lang="ts">
import {subscribeToQuery} from 'src/helpers/data-helpers';
import {Ref} from 'vue';
import {COMPANY, MY_EMPLOYEES} from 'src/data/queries/QUERIES';
//todo: after merge write instead of COMPANY -> MY_COMPANY and take just my as an employee my id
const company = {readable_id: 125367}
const employee = {readable_id: 5517267}
// const company = subscribeToQuery(COMPANY) as Ref<Record<string, Array<Record<string, unknown>>>>
// const employee = subscribeToQuery(MY_EMPLOYEES) as Ref<Record<string, Array<Record<string, unknown>>>>
</script>
