<template>
  <q-header class="row bg-white shadow-5 justify-between">
    <div class="row">
      <img
          alt="Polygon Software"
          src="https://media-exp1.licdn.com/dms/image/C4D0BAQEI1LFXsM4DVA/company-logo_200_200/0/1593964710523?e=2159024400&v=beta&t=k1qIEpVNRq-GBvW1fZt2SKvcuq59WL8J0IuLW0qMSG4"
          style="height: 50px"
          class="q-ma-sm"
      >
      <h5 class="text-black q-pa-none q-ma-md">
        PolygonSoftware Template
      </h5>
    </div>

    <q-btn label="Logout" class="text-primary" flat @click="logout"/>
  </q-header>
</template>

<script setup lang="ts">

import { inject } from 'vue'

const $authService: any = inject('$authService')

function logout(){
  $authService.logout();
}
</script>

<style scoped>

</style>
