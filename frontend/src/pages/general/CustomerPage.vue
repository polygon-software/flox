<template>
  <q-page class="column items-center justify-start full-width">
    <!-- Title: Projects -->
    <h5>{{ $tc('dashboard.project', 0) }}</h5>

    <p>TODO, Customer is {{ customerId }}</p>

    <!-- Title: Device pool -->
    <h5>{{ $t('dashboard.device_pool') }}</h5>

    <p>TODO TODO</p>

  </q-page>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router';

const route = useRoute()

const customerId = route.path.split('/').pop()
</script>
