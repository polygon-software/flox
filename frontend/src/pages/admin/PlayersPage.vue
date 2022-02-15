<template>
  <q-page class="flex" style="flex-direction: column">
    <!-- Top row: title -->
    <h6 class="q-ma-md">{{ $t('admin.players') }}</h6>

    <!-- Body: Table with tabs etc. -->
    <div
      class="column full-height items-start q-pa-md full-width"
    >
      <!-- Search bar -->
      <q-input
        v-model="search"
        dense
        rounded
        outlined
        type="search"
        class="q-mb-md"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Tab header -->
      <div style="margin-bottom: 16px">
        <q-tabs
          v-model="statusFilter"
          dense
          class="q-mt-xs text-grey"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab
            v-for="tab in tabs"
            :key="tab.value"
            :name="tab.value"
            :label="tab.label"
            no-caps
          >
          </q-tab>
        </q-tabs>
        <q-separator />
      </div>

      <!-- Table view of products -->
      <PlayersTable
        :search="search"
        :status-filter="statusFilter"
      />
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {USER_STATUS} from '../../../../shared/definitions/ENUM';
import PlayersTable from 'components/table/PlayersTable.vue';

// Search term
const search = ref('')

// Selected tab/status filter
const statusFilter: Ref<USER_STATUS|null> = ref(null)

// TODO possible user statuses?
const tabs = [
  {
    value: null,
    label: i18n.global.t('general.all'),
  },
  {
    value: USER_STATUS.APPLIED,
    label: i18n.global.t('user_status.applied'),
  },
  {
    value: USER_STATUS.ACTIVE,
    label: i18n.global.t('user_status.active'),
  },
  {
    value: USER_STATUS.DISABLED,
    label: i18n.global.t('user_status.disabled'),
  },
]

</script>
