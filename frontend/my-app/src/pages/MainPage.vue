<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-4">
    <MenuBar :logged-in="store.getLoggedInStatus"/>
    <q-page class="flex flex-center">
      <!-- Test table for visualizing data fetched via GraphQL/Apollo -->
      <div class="column">
        <div class="row q-pa-md">
          <SampleTable/>
          <SampleForm/>
        </div>

        <div class="q-pa-md">
          <SampleSubscriptionTable/>
        </div>
      </div>
    </q-page>
  </q-layout>
</template>

<script setup lang="ts">
import SampleTable from "../components/SampleTable"
import SampleForm from "../components/SampleForm"
import SampleSubscriptionTable from "../components/SampleSubscriptionTable"
import MenuBar from "../components/menu/MenuBar"
import * as store from "../store/store"

</script>

<style scoped>

</style>
