<template>
  <q-card class="justify-center">
    <div class="row justify-between items-center">
      <h5 class="q-ma-md text-black">
        {{ $t('card_titles.orders') }}
      </h5>
      <!-- Create new order -->
      <q-btn
        class="btn-col q-mx-md text-white bg-primary"
        icon="add"
        :label="$t('buttons.create')"
        @click="createOrder"
      />
    </div>

    <DataTable
      id="adress-table"
      :columns="columns"
      :query="SEARCH_FORMS"
      multi
      :update-mutation="UPDATE_FORM"
    >
    </DataTable>
  </q-card>

  <!-- Bottom button row -->
  <div class="row full-width no-wrap">
    <!-- Edit -->
    <q-btn
      class="btn-col q-mx-md text-white bg-primary"
      style="margin-left: 0"
      icon="edit"
      :label="$t('buttons.edit')"
      @click="placeholder"
    />

    <!-- Delete -->
    <q-btn
      class="btn-col q-mx-md text-white bg-primary"
      icon="delete"
      :label="$t('buttons.delete')"
      @click="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { format } from 'date-fns';

import { SEARCH_FORMS } from 'src/data/form/form.query';
import { ColumnAlign } from 'components/tables/useDataTable';
import { BOOLEAN_FIELD_TYPE, JOB_STATUS, JOB_TYPE } from 'src/data/ENUM';
import RouterService from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import { i18n } from 'boot/i18n';
import { UPDATE_FORM } from 'src/data/form/form.mutation';

import DataTable from './DataTable.vue';

const $routerService: RouterService | undefined = inject('$routerService');
const columns = computed(() => [
  {
    name: 'creationDate',
    label: i18n.global.t('fields.creation_date'),
    field: 'createdAt',
    align: ColumnAlign.left,
    format: (val: number): string => format(new Date(val ?? 0), 'dd.MM.yyyy'),
    sortable: true,
    edit: false,
    visible: true,
  },
  {
    name: 'description',
    label: i18n.global.t('fields.description'),
    field: 'description',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: false,
  },
  {
    name: 'orderNumber',
    label: i18n.global.t('fields.order_number'),
    field: 'internalOrderNumber',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
  },
  {
    name: 'orderType',
    label: i18n.global.t('fields.order_type'),
    field: 'job.type',
    format: (value: JOB_TYPE): string =>
      i18n.global.t(`enum.job_type.${value}`),
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
  },
  {
    name: 'status',
    label: i18n.global.t('fields.status'),
    field: 'job.status',
    format: (value: JOB_STATUS): string =>
      i18n.global.t(`enum.job_status.${value}`),
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
  },
  {
    name: 'erp',
    label: i18n.global.t('fields.erp'),
    field: 'wasPulled',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
  },
  {
    name: 'emergency',
    label: i18n.global.t('fields.emergency'),
    field: 'isEmergency',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
    booleanFieldType: BOOLEAN_FIELD_TYPE.TOGGLE,
  },
  {
    name: 'done',
    label: i18n.global.t('fields.done'),
    field: 'isFinished',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
    booleanFieldType: BOOLEAN_FIELD_TYPE.TOGGLE,
  },
  {
    name: 'fromErp',
    label: i18n.global.t('fields.from_erp'),
    field: 'isPullable',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
    booleanFieldType: BOOLEAN_FIELD_TYPE.TOGGLE,
  },
]);

/**
 * Route to create order page
 * @returns {void}
 */
async function createOrder(): Promise<void> {
  await $routerService?.routeTo(ROUTES.CREATE_ORDER);
}

/**
 * Function that does nothing and is a placeholder
 * TODO: Implement functionality
 */
function placeholder(): void {
  // Do nothing
}
</script>

<style>
/* Customizing TRs doesn't work in scoped styles, thus we use an ID-based approach */
#adress-table .q-table tbody tr:nth-child(even) {
  background-color: var(--q-accent);
}
</style>
