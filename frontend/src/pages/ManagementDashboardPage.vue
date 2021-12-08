<template>
  <q-page
    class="flex flex-center">
    <div
      class="q-pa-md"
      style="width: 800px; display: flex; flex-direction: column"
    >

      <!-- Employee Overview -->
      <EmployeeTable/>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue'
import {i18n} from 'boot/i18n';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import EmployeeTable from 'components/tables/EmployeeTable.vue';

</script>
