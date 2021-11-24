<template>
  <q-page class="flex flex-center">
    <q-card class="square q-pa-md q-ma-md">
      <q-card-section>
        {{ $t('set_password.description')}}
      </q-card-section>
      <q-card-section>
        <SetPassword @submit="submitPassword"/>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
/**
 * this page lets you set a password using the SetPassword component
 */
import SetPassword from '../components/SetPassword.vue';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {inject} from 'vue';

const $routerService: RouterService|undefined = inject('$routerService')


/**
 * submits the new password and redirects
 * @param event
 */
async function submitPassword(event) {
  console.log('new password', event)
  setTimeout(function() {$routerService?.routeTo(ROUTES.MANAGEMENT_DASHBOARD)}, 5000);
  await $routerService?.routeTo(ROUTES.SUCCESS)
}
</script>

<style scoped>

</style>
