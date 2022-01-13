<template>
  <q-page class="flex" style="flex-direction: column">
    <!-- Top row: title -->
    <h6 class="q-ma-md">{{ $t('dashboards.announcements') }}</h6>

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

      <!-- Table view of products -->
      <AnnouncementsTable
        :search="search"
        :status-filter="statusFilter"
      />
    </div>

  </q-page>
</template>

<script setup lang="ts">
import AnnouncementsTable from 'components/table/AnnouncementsTable.vue';
import {ref} from 'vue';

// Search term
const search = ref('')
</script>
