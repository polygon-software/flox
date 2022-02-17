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
