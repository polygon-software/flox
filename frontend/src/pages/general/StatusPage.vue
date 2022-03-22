<template>
  <q-page class="column items-center justify-start full-width q-pb-xl">
    <!-- Title -->
    <h5>{{ $t('status.title') }} {{ stationId }}</h5>

    <ClientConnectivityTable :cli="stationId"/>

    <DeviceLogTable :cli="stationId"/>

    <FTPLogFilesTable
      v-if="type === 'MR3000'"
      :cli="stationId"
    />

    <!-- REST Log (MR3000 only)-->
    <DeviceLogTable
      v-if="type === 'MR3000'"
      :cli="stationId"
      :title="$t('log_files.rest_log_file')"
      prefix="REST"
    />
  </q-page>
</template>

<script setup lang="ts">
import ClientConnectivityTable from 'components/tables/ClientConnectivityTable.vue';
import DeviceLogTable from 'components/tables/DeviceLogTable.vue';
import {computed, defineProps} from 'vue';
import FTPLogFilesTable from 'components/tables/FTPLogFilesTable.vue';
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
