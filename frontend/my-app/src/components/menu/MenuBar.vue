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
      <p
          class="text-grey-7"
          v-if="props.loggedIn && userName"
      >
        Logged in as {{ userName }}
      </p>
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
    <q-btn
        v-if="!props.loggedIn"
        label="Password Forgotten"
        class="text-primary"
        flat
        @click="forgottenPassword"
    />
  </div>

  </q-header>
</template>

<script setup lang="ts">

import {inject, defineProps, ref, computed} from 'vue'
import {AuthenticationService} from "@/services/AuthService";

//@ts-ignore
const $authService: ref<AuthenticationService> = inject('$authService')

const props = defineProps({
  loggedIn: Boolean
})

const userName = computed(() =>
    {
      console.log($authService.value.cognitoUser)
      if($authService.value.cognitoUser){
        return $authService.value.cognitoUser.username
      }

      return ''
    }
)

/**
 * Logs out the current user
 */
function logout(){
  $authService.value.logout();
}

/**
 * Triggers a password change for the currently logged in user
 */
function changePassword() {
  $authService.value.changePasswordDialog()
}

/**
 * Triggers a password change for a non-logged in user
 */
function forgottenPassword() {
  $authService.value.resetPasswordDialog();
}

</script>

<style scoped>

</style>
