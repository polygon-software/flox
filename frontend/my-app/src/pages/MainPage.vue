<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-4">
    <q-header class="row bg-white shadow-5">
      <img
          alt="Polygon Software"
          src="https://media-exp1.licdn.com/dms/image/C4D0BAQEI1LFXsM4DVA/company-logo_200_200/0/1593964710523?e=2159024400&v=beta&t=k1qIEpVNRq-GBvW1fZt2SKvcuq59WL8J0IuLW0qMSG4"
          style="height: 130px">
      <h4 class="text-black">Hello World! Test Application is running.</h4>
    </q-header>

    <q-page class="flex flex-center">
      <!-- Test table for visualizing data fetched via GraphQL/Apollo -->
      <SampleTable/>
      <SampleForm/>
    </q-page>
  </q-layout>
</template>

<script setup lang="ts">
import SampleTable from "../components/SampleTable"
import SampleForm from "../components/SampleForm"
</script>

<style scoped>

</style>
