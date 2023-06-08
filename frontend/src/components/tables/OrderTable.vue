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
      :delete-mutation="DELETE_FORM"
      :filter="filter"
      :query="SEARCH_FORMS"
      :update-mutation="UPDATE_FORM"
      delete-selection
      multi
      @update:selected="updateSelectedItems"
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
            <!-- Filter by status -->
            <q-item class="row justify-between items-center">
              <q-item-section class="col-3">
                <div class="row justify-between items-center">
                  <q-checkbox v-model="statusActive" class="col-3" dense />
                  <q-item-label class="col-8">
                    {{ $t('fields.status') }}
                  </q-item-label>
                </div>
              </q-item-section>
              <q-item-section class="col-8" side>
                <q-select
                  v-model="statusFilter"
                  :options="translatedObjects(JOB_STATUS, 'job_status')"
                  borderless
                  dense
                  hide-bottom-space
                />
              </q-item-section>
            </q-item>

            <!-- Filter by type -->
            <q-item class="row justify-between items-center">
              <q-item-section class="col-3">
                <div class="row justify-between items-center">
                  <q-checkbox v-model="typeActive" class="col-3" dense />
                  <q-item-label class="col-8">
                    {{ $t('fields.order_type') }}
                  </q-item-label>
                </div>
              </q-item-section>
              <q-item-section class="col-8" side>
                <q-select
                  v-model="typeFilter"
                  :options="translatedObjects(JOB_TYPE, 'job_type')"
                  borderless
                  dense
                  hide-bottom-space
                />
              </q-item-section>
            </q-item>

            <!-- Filter by whether is an emergency -->
            <q-item class="row justify-between items-center">
              <q-item-section class="col-3">
                <div class="row justify-between items-center">
                  <q-checkbox v-model="emergencyActive" class="col-3" dense />
                  <q-item-label class="col-8">
                    {{ $t('fields.emergency') }}
                  </q-item-label>
                </div>
              </q-item-section>
              <q-item-section class="col-8" side>
                <q-toggle v-model="emergencyFilter" dense />
              </q-item-section>
            </q-item>

            <!-- Filter by whether a order is done -->
            <q-item class="row justify-between items-center">
              <q-item-section class="col-3">
                <div class="row justify-between items-center">
                  <q-checkbox v-model="doneActive" class="col-3" dense />
                  <q-item-label class="col-8">
                    {{ $t('fields.done') }}
                  </q-item-label>
                </div>
              </q-item-section>
              <q-item-section class="col-8" side>
                <q-toggle v-model="doneFilter" dense />
              </q-item-section>
            </q-item>

            <!-- Filter by creation date -->
            <q-item class="row justify-between items-center q-mb-md">
              <q-item-section class="col-3">
                <div class="row justify-between items-center">
                  <q-checkbox v-model="creationActive" class="col-3" dense />
                  <q-item-label class="col-8">
                    {{ $t('fields.creation_date') }}
                  </q-item-label>
                </div>
              </q-item-section>
              <q-item-section class="col-6" side>
                <q-input
                  v-model="creationFilter"
                  :rules="[
                    (val) =>
                      IS_VALID_DATE_STRING(val, quasarDateFormat) ||
                      $t('errors.invalid_date'),
                  ]"
                  filled
                  mask="##.##.####"
                >
                  <template #append>
                    <q-icon
                      class="cursor-pointer"
                      name="event"
                      @click="resetInvalidCreationFilter"
                    >
                      <q-popup-proxy
                        cover
                        transition-hide="scale"
                        transition-show="scale"
                      >
                        <q-date
                          v-model="creationFilter"
                          :mask="quasarDateFormat"
                        >
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

            <!-- Filter by whether it has been pulled by ERP -->
            <q-item class="row justify-between items-center q-mb-md">
              <q-item-section class="col-3">
                <div class="row justify-between items-center">
                  <q-checkbox v-model="erpActive" class="col-3" dense />
                  <q-item-label class="col-8"
                    >{{ $t('fields.erp') }}
                  </q-item-label>
                </div>
              </q-item-section>
              <q-item-section class="col-6" side>
                <q-input
                  v-model="erpFilter"
                  :rules="[
                    (val) =>
                      IS_VALID_DATE_STRING(val, quasarDateFormat) ||
                      $t('errors.invalid_date'),
                  ]"
                  filled
                  mask="##.##.####"
                >
                  <template #append>
                    <q-icon
                      class="cursor-pointer"
                      name="event"
                      @click="resetInvalidErpFilter"
                    >
                      <q-popup-proxy
                        cover
                        transition-hide="scale"
                        transition-show="scale"
                      >
                        <q-date v-model="erpFilter" :mask="quasarDateFormat">
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
      :disable="selectedItems.length !== 1"
      class="btn-col q-mx-md text-white bg-primary"
      style="margin-left: 0"
      icon="edit"
      :label="$t('buttons.edit')"
      @click="editOrder"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';

import { SEARCH_FORMS } from 'src/data/form/form.query';
import { ColumnAlign } from 'components/tables/useDataTable';
import {
  BOOLEAN_FIELD_TYPE,
  JOB_STATUS,
  JOB_TYPE,
  translatedObjects,
} from 'src/data/ENUM';
import RouterService from 'src/services/RouterService';
import { i18n } from 'boot/i18n';
import { DELETE_FORM, UPDATE_FORM } from 'src/data/form/form.mutation';
import ROUTES from 'src/router/routes';
import FormEntity from 'src/data/form/entities/form.entity';
import {
  dateFormat,
  formatDate,
  formatDateTime,
  parseDate,
} from 'src/format/date.format';
import JobEntity from 'src/data/job/entities/jobEntity';
import BaseEntity from 'src/flox/core/base-entity/entities/BaseEntity';
import { IS_VALID_DATE_STRING } from 'src/flox/modules/form/data/RULES';

import DataTable from './DataTable.vue';

const $routerService: RouterService | undefined = inject('$routerService');
const quasarDateFormat = dateFormat.toUpperCase();

const statusFilter = ref(translatedObjects(JOB_STATUS, 'job_status')[0]);
const typeFilter = ref(translatedObjects(JOB_TYPE, 'job_type')[0]);
const erpFilter = ref(formatDate(new Date()));
const emergencyFilter = ref(false);
const doneFilter = ref(false);
const creationFilter = ref(formatDate(new Date()));

const isErpFilterValid = computed(() =>
  IS_VALID_DATE_STRING(erpFilter.value, quasarDateFormat)
);

const isCreationFilterValid = computed(() =>
  IS_VALID_DATE_STRING(creationFilter.value, quasarDateFormat)
);

const statusActive = ref(false);
const typeActive = ref(false);
const erpActive = ref(false);
const emergencyActive = ref(false);
const doneActive = ref(false);
const creationActive = ref(false);

/**
 * If the date of the ERP filter is invalid, reset it to today's date.
 * This is necessary because the date picker does not validate the date.
 * If we don't do this, the date picker will accept an invalid date like 05.06.20 and this is very annoying.
 */
function resetInvalidErpFilter(): void {
  if (!isErpFilterValid.value) {
    erpFilter.value = formatDate(new Date());
  }
}

/**
 * If the date of the creation filter is invalid, reset it to today's date.
 * This is necessary because the date picker does not validate the date.
 * If we don't do this, the date picker will accept an invalid date like 05.06.20 and this is very annoying.
 */
function resetInvalidCreationFilter(): void {
  if (!isCreationFilterValid.value) {
    creationFilter.value = formatDate(new Date());
  }
}

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
    status: statusActive.value ? statusFilter.value.value : undefined,
    type: typeActive.value ? typeFilter.value.value : undefined,
  },
  pulledAt: erpActive.value ? parseDate(erpFilter.value) : undefined,
  isEmergency: emergencyActive.value ? emergencyFilter.value : undefined,
  isFinished: doneActive.value ? doneFilter.value : undefined,
  createdAt: creationActive.value ? parseDate(creationFilter.value) : undefined,
}));
const columns = computed(() => [
  {
    name: 'createdAt',
    label: i18n.global.t('fields.creation_date'),
    field: 'createdAt',
    align: ColumnAlign.left,
    format: (val: number): string =>
      val ? formatDateTime(new Date(val)) : '-',
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
    name: 'internalOrderNumber',
    label: i18n.global.t('fields.order_number'),
    field: 'internalOrderNumber',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
  },
  {
    name: 'job.type',
    label: i18n.global.t('fields.order_type'),
    field: (row: FormEntity): JobEntity | undefined => row.job,
    format: (value: JobEntity): string =>
      value ? i18n.global.t(`enum.job_type.${value?.type as string}`) : '-',
    align: ColumnAlign.left,
    edit: false,
    visible: true,
  },
  {
    name: 'job.status',
    label: i18n.global.t('fields.status'),
    field: (row: FormEntity): JobEntity | undefined => row.job,
    format: (value: JobEntity): string =>
      value ? i18n.global.t(`enum.job_status.${value?.status as string}`) : '-',
    align: ColumnAlign.left,
    edit: false,
    visible: true,
  },
  {
    name: 'pulledAt',
    label: i18n.global.t('fields.erp'),
    field: 'pulledAt',
    format: (val: Date): string => (val ? formatDateTime(new Date(val)) : '-'),
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
  },
  {
    name: 'isEmergency',
    label: i18n.global.t('fields.emergency'),
    field: 'isEmergency',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
    booleanFieldType: BOOLEAN_FIELD_TYPE.TOGGLE,
  },
  {
    name: 'isFinished',
    label: i18n.global.t('fields.done'),
    field: 'isFinished',
    align: ColumnAlign.left,
    sortable: true,
    edit: false,
    visible: true,
    booleanFieldType: BOOLEAN_FIELD_TYPE.TOGGLE,
  },
  {
    name: 'isPullable',
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

const selectedItems = ref<BaseEntity[]>([]);

/**
 * Edit selected items
 */
async function editOrder(): Promise<void> {
  await $routerService?.routeTo(
    ROUTES.EDIT_ORDER,
    { orderUuid: selectedItems.value[0].uuid },
    false
  );
}

/**
 * Updates the selected items of the order table
 * @param selected
 */
function updateSelectedItems(selected: BaseEntity[]): void {
  selectedItems.value = selected;
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
