<template>
  <q-page class="column items-center justify-start full-width q-pb-xl">
    <!-- Title -->
    <h5>{{ $t('status.title') }} {{ stationId }}</h5>

    <ClientConnectivityTable :cli="stationId"/>

    <LogFilesTable :cli="stationId"/>

    <FTPLogFilesTable
      v-if="deviceType === 'MR3000'"
      :cli="stationId"
    />

    <RESTLogFilesTable
      v-if="deviceType === 'MR3000'"
      :cli="stationId"
    />
  </q-page>
</template>

<script setup lang="ts">
import ClientConnectivityTable from 'components/tables/ClientConnectivityTable.vue';
import LogFilesTable from 'components/tables/DeviceLogTable.vue';
import {computed, defineProps} from 'vue';
import FTPLogFilesTable from 'components/tables/FTPLogFilesTable.vue';
import RESTLogFilesTable from 'components/tables/RESTLogFilesTable.vue';
import {deviceType} from 'src/helpers/device-helpers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  stationId: {
    required: true,
    type: String
  }
})

// Device type (MR2000 or MR3000)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const type = computed(() => {
  return deviceType(props.stationId)
})

</script>
