<template>
  <h4>{{ $t('pages.home.title') }}</h4>
  <div class="row" style="gap: 25px">
    <OrderTable />
  </div>
</template>

<script setup lang="ts">
import OrderTable from 'components/tables/OrderTable.vue';
</script>
