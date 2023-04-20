<template>
  <q-layout view="lHh Lpr lFf" class="dimmed-background">
    <MenuBar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MenuBar from '../components/menu/MenuBar.vue';
</script>

<style lang="scss">
.dimmed-background {
  background-color: $light-dimmed-background;
}
</style>
