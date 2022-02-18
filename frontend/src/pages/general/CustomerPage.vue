<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title: Projects -->
    <h5>{{ $tc('dashboard.project', 0) }}</h5>

    <ProjectsTable/>

    <!-- Title: Device pool -->
    <h5>{{ $t('dashboard.device_pool') }}</h5>

    <DevicePoolsTable/>

  </q-page>
</template>

<script setup lang="ts">
import ProjectsTable from 'components/tables/ProjectsTable.vue';
import DevicePoolsTable from 'components/tables/DevicePoolsTable.vue';
</script>
