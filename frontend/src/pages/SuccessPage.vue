<template>
  <q-page class="flex flex-center">
    <q-card class="square q-pa-md q-ma-md">
      <q-card-section
        class="col"
      >
        <h3>{{ $t('confirmed_registration') }}</h3>
        <h5>{{ $t('redirect_to_login') }}</h5>
      </q-card-section>

      <q-card-section
        class="col"
      >
        <div class="flex row justify-center items-center">
          <q-icon name="done" size="300px" color="green"/>
        </div>
      </q-card-section>

      <q-card-section
        class="col"
      >
        <div class="flex row justify-center items-center">
          <q-btn
            class="col-2 q-ma-md"
            style="width: 150px"
            :label="$t('back_to_login')"
            @click="backToLogin"
            color="primary"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject} from 'vue'
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
const $routerService: RouterService = inject('$routerService')


async function backToLogin({username}:{username: string}): Promise<void>{
  // Redirect to login page
  await $routerService.routeTo(ROUTES.LOGIN)
}
</script>

<style scoped>

</style>
