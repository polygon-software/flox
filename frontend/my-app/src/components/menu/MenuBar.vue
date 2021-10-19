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
  <div class="row">
    <q-btn
        v-if="props.loggedIn"
        label="Logout"
        class="text-primary"
        flat
        @click="logout"
    />
    <q-btn
        v-if="props.loggedIn"
        label="Change Password"
        class="text-primary"
        flat
        @click="changePassword"
    />
  </div>

  </q-header>
</template>

<script setup lang="ts">

import { inject, defineProps, ref } from 'vue'
import {AuthenticationService} from "@/plugins/AuthService";

//@ts-ignore
const $authService: ref<AuthenticationService> = inject('$authService')

const props = defineProps({
  loggedIn: Boolean
})

/**
 * todo
 */
function logout(){
  $authService.value.logout();
}

function changePassword() {
  $authService.value.changePasswordDialog()
}
</script>

<style scoped>

</style>
