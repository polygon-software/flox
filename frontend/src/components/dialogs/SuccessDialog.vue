<template>
  <q-dialog
      ref="dialogRef"
      :persistent="true"
  >
    <q-card class="q-pa-sm" style="width: 600px; min-height: 200px">
      <h5 style="text-align: center">{{ $t('success.saved_successfully') }}</h5>

      <q-card-section class="bg-white text-white flex flex-center q-pb-xs q-mb-xs q-mt-lg" style="height: 180px">
        <q-icon name="check_circle" size="150px" color="green" style="font-weight: 200;" items-center/>
      </q-card-section>

      <q-card-section style="height: 220px; text-align: center;" class="q-pt-xs q-mt-xs">
        <br/>
        <br/>
        <q-btn
          :label="$t('success.back_to_home')"
          outline
          class="text-grey"
          @click="redirectOnClick"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import {inject} from 'vue';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';

const { dialogRef } = useDialogPluginComponent()

const routerService: RouterService|undefined = inject('$routerService')

/**
 * This component defines a generic success message that has a redirect button and automatically redirects.
 */

const autoRedirectDurationMS = 5000
/**
 * Routes to  desired path - given through URL
 * @returns {Promise<void>} - done
 */
async function redirectOnClick(): Promise<void> {
  // Redirect to customer page
  await routerService?.routeTo(ROUTES.CUSTOMERS)
}
// Set up auto-redirect
setTimeout(function () {
  void routerService?.routeTo(ROUTES.CUSTOMERS)
}, autoRedirectDurationMS);


</script>
