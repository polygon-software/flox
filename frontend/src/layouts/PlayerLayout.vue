<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <PlayerMenuBar/>
    <q-page-container>
      <router-view />
    </q-page-container>
    <PlayerFooter/>
  </q-layout>
</template>

<script setup lang="ts">
import PlayerMenuBar from 'components/menu/PlayerMenuBar.vue';
import PlayerFooter from 'components/menu/PlayerFooter.vue';
</script>
