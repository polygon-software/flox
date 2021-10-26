<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-4">
    <MenuBar/>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MenuBar from '../components/menu/MenuBar'
</script>
