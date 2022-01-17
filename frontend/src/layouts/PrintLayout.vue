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

/**
 * This layout is meant to be used on pages that must be printed, and allows for easy hiding of UI components
 * (e.g. on DossierFinalDocumentPage)
 */

</script>

<style scoped>
@media print {
  .q-header {
    display: none !important;
  }
}

</style>
