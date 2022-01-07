<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <MenuBar/>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MenuBar from 'src/components/menu/MenuBar.vue'
</script>

<style scoped>

@media print {
  html, body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
  }

  .q-header {
    display: none !important;
  }
}

</style>
