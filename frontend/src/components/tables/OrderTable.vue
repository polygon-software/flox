<template>
  <DataTable id="adress-table" multi :columns="columns" :query="ALL_FORMS">
  </DataTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { format } from 'date-fns';

import { ALL_FORMS } from 'src/data/form/form.query';
import { ColumnAlign } from 'components/tables/useDataTable';
import { JOB_STATUS, JOB_TYPE } from 'src/data/ENUM';

import DataTable from './DataTable.vue';

const { t } = useI18n();

const columns = computed(() => [
  {
    name: 'creationDate',
    label: t('fields.creationDate'),
    field: 'createdAt',
    align: ColumnAlign.left,
    format: (val: number): string => format(new Date(val ?? 0), 'dd.MM.yyyy'),
    sortable: true,
    edit: false,
  },
  {
    name: 'orderNumber',
    label: t('fields.orderNumber'),
    field: 'internalOrderNumber',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
  },
  {
    name: 'orderType',
    label: t('fields.orderType'),
    field: 'job.type',
    format: (value: JOB_TYPE): string => t(`enum.job_type.${value}`),
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
  },
  {
    name: 'status',
    label: t('fields.status'),
    field: 'job.status',
    format: (value: JOB_STATUS): string => t(`enum.job_status.${value}`),
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
  },
  {
    name: 'erp',
    label: t('fields.erp'),
    field: 'wasPulled',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
  },
  {
    name: 'emergency',
    label: t('fields.emergency'),
    field: 'isEmergency',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
  },
  {
    name: 'done',
    label: t('fields.done'),
    field: 'isFinished',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
  },
  {
    name: 'fromErp',
    label: t('fields.fromErp'),
    field: 'isPullable',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
  },
]);
</script>

<style>
/* Customizing TRs doesn't work in scoped styles, thus we use an ID-based approach */
#adress-table .q-table tbody tr:nth-child(even) {
  background-color: var(--q-accent);
}
</style>
