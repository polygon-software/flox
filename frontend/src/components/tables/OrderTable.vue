<template>
  <q-card class="justify-center full-width">
    <div class="row justify-between items-center">
      <h5 class="q-ma-md text-black">
        {{ $t('card_titles.orders') }}
      </h5>
      <!-- Create new order -->
      <q-btn
        :label="$t('buttons.create')"
        class="btn-col q-mx-md text-white bg-primary"
        icon="add"
        @click="createOrder"
      />
    </div>
    <DataTable
      id="order-table"
      :columns="columns"
      :filter="filter"
      :query="SEARCH_FORMS"
      :update-mutation="UPDATE_FORM"
      :delete-mutation="DELETE_FORM"
      delete-selection
      multi
    >
      <template #header>
        <q-btn-dropdown class="q-mr-xl" flat multiple>
          <template #label>
            <q-icon name="filter_list" />
            {{ $t('buttons.filter') }}
            <q-chip v-if="numFilters" class="active-filter" dense>
              {{ numFilters }}
            </q-chip>
          </template>
          <q-list>
            <q-item
              :active="statusActive"
              active-class="active-filter"
              clickable
              @click="statusActive = !statusActive"
            >
              <q-item-section class="q-mr-lg">
                <q-item-label>{{ $t('fields.status') }}</q-item-label>
              </q-item-section>
              <q-item-section side @click.stop>
                <q-select
                  v-model="statusFilter"
                  :options="Object.values(JOB_STATUS)"
                  borderless
                  dense
                  hide-bottom-space
                />
              </q-item-section>
            </q-item>

            <q-item
              :active="typeActive"
              active-class="active-filter"
              clickable
              @click="typeActive = !typeActive"
            >
              <q-item-section class="q-mr-lg">
                <q-item-label>{{ $t('fields.order_type') }}</q-item-label>
              </q-item-section>
              <q-item-section side @click.stop>
                <q-select
                  v-model="typeFilter"
                  :options="Object.values(JOB_TYPE)"
                  borderless
                  dense
                  hide-bottom-space
                />
              </q-item-section>
            </q-item>

            <q-item
              :active="erpActive"
              active-class="active-filter"
              clickable
              @click="erpActive = !erpActive"
            >
              <q-item-section class="q-mr-lg">
                <q-item-label>{{ $t('fields.erp') }}</q-item-label>
              </q-item-section>
              <q-item-section side @click.stop>
                <q-checkbox v-model="erpFilter" dense />
              </q-item-section>
            </q-item>

            <q-item
              :active="emergencyActive"
              active-class="active-filter"
              clickable
              @click="emergencyActive = !emergencyActive"
            >
              <q-item-section class="q-mr-lg">
                <q-item-label>{{ $t('fields.emergency') }}</q-item-label>
              </q-item-section>
              <q-item-section side @click.stop>
                <q-toggle v-model="emergencyFilter" dense />
              </q-item-section>
            </q-item>

            <q-item
              :active="doneActive"
              active-class="active-filter"
              clickable
              @click="doneActive = !doneActive"
            >
              <q-item-section class="q-mr-lg">
                <q-item-label>{{ $t('fields.done') }}</q-item-label>
              </q-item-section>
              <q-item-section side @click.stop>
                <q-toggle v-model="doneFilter" dense />
              </q-item-section>
            </q-item>

            <q-item
              :active="creationActive"
              active-class="active-filter"
              clickable
              @click="creationActive = !creationActive"
            >
              <q-item-section class="q-mr-lg">
                <q-item-label>{{ $t('fields.creation_date') }}</q-item-label>
              </q-item-section>
              <q-item-section side @click.stop>
                <q-input v-model="creationFilter" filled mask="##.##.####">
                  <template #append>
                    <q-icon class="cursor-pointer" name="event">
                      <q-popup-proxy
                        cover
                        transition-hide="scale"
                        transition-show="scale"
                      >
                        <q-date v-model="creationFilter" mask="DD.MM.YYYY">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              color="primary"
                              flat
                              label="Close"
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
    </DataTable>
  </q-card>

  <!-- Bottom button row -->
  <div class="row full-width no-wrap q-mb-lg">
    <!-- Edit -->
    <q-btn
      :label="$t('buttons.edit')"
      class="btn-col q-mx-md text-white bg-primary"
      icon="edit"
      style="margin-left: 0"
      @click="placeholder"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';

import { SEARCH_FORMS } from 'src/data/form/form.query';
import { ColumnAlign } from 'components/tables/useDataTable';
import { BOOLEAN_FIELD_TYPE, JOB_STATUS, JOB_TYPE } from 'src/data/ENUM';
import RouterService from 'src/services/RouterService';
import { i18n } from 'boot/i18n';
import { DELETE_FORM, UPDATE_FORM } from 'src/data/form/form.mutation';
import ROUTES from 'src/router/routes';
import FormEntity from 'src/data/form/entities/form.entity';
import { formatDate, parseDate } from 'src/format/date.format';
import JobEntity from 'src/data/job/entities/jobEntity';

import DataTable from './DataTable.vue';

const $routerService: RouterService | undefined = inject('$routerService');

const statusFilter = ref(JOB_STATUS.OPEN);
const typeFilter = ref(JOB_TYPE.APPOINTMENT);
const erpFilter = ref(false);
const emergencyFilter = ref(false);
const doneFilter = ref(false);
const creationFilter = ref(formatDate(new Date()));

const statusActive = ref(false);
const typeActive = ref(false);
const erpActive = ref(false);
const emergencyActive = ref(false);
const doneActive = ref(false);
const creationActive = ref(false);

const numFilters = computed(() => {
  let num = 0;
  if (statusActive.value) num += 1;
  if (typeActive.value) num += 1;
  if (erpActive.value) num += 1;
  if (emergencyActive.value) num += 1;
  if (doneActive.value) num += 1;
  if (creationActive.value) num += 1;
  return num;
});

const filter = computed(() => ({
  job: {
    status: statusActive.value ? statusFilter.value : undefined,
    type: typeActive.value ? typeFilter.value : undefined,
  },
  wasPulled: erpActive.value ? erpFilter.value : undefined,
  isEmergency: emergencyActive.value ? emergencyFilter.value : undefined,
  isFinished: doneActive.value ? doneFilter.value : undefined,
  createdAt: creationActive.value ? parseDate(creationFilter.value) : undefined,
}));
const columns = computed(() => [
  {
    name: 'creationDate',
    label: i18n.global.t('fields.creation_date'),
    field: 'createdAt',
    align: ColumnAlign.left,
    format: (val: number): string => (val ? formatDate(new Date(val)) : '-'),
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
    field: (row: FormEntity): JobEntity | undefined => row.job,
    format: (value: JobEntity): string =>
      value ? i18n.global.t(`enum.job_type.${value?.type as string}`) : '-',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
  },
  {
    name: 'status',
    label: i18n.global.t('fields.status'),
    field: (row: FormEntity): JobEntity | undefined => row.job,
    format: (value: JobEntity): string =>
      value ? i18n.global.t(`enum.job_status.${value?.status as string}`) : '-',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
  },
  {
    name: 'erp',
    label: i18n.global.t('fields.erp'),
    field: 'pulledAt',
    format: (val: Date): string => (val ? formatDate(new Date(val)) : '-'),
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
#order-table .q-table tbody tr:nth-child(even) {
  background-color: var(--q-accent);
}

.active-filter {
  background-color: var(--q-accent);
  color: black;
}
</style>
