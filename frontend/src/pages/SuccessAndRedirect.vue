<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 600px">
      <q-card-section class="bg-green text-white flex flex-center" style="height: 100px">
        <q-icon name="done" size="70px" color="white" items-center/>
      </q-card-section>

      <q-card-section align="center" style="height: 200px">
        <p class="text-h6 q-mb-xs">{{ successMessage ?? $t('success') }}</p>
        <p class="text-subtitle1">{{ nextMessage ?? $t('successful_application') }}</p>
        <br/>
        <br/>
        <p v-if="autoRedirect">{{ nextMessage ?? $t('successful_application') }}</p>
        <q-btn
          else
          outline style="color: green;"
          :label="buttonLabel ?? $t('back_to_login')"
          @click="redirectOnClick"/>
      </q-card-section>
    </q-card>
  </q-page>

</template>

<script setup lang="ts">
import {defineProps, inject} from "vue";
import ROUTES from "src/router/routes";
import {RouterService} from "src/services/RouterService";

const $routerService: RouterService = inject('$routerService')


/**
 * This component defines a generic form that can have a single or multiple pages.
 * It takes the following properties:
 * @param {Object[]} pages - the pages to show, each containing fields, label and key
 * @param {finish} function - the function to call once the form is completed
 * @param {string} [finishLabel] - the label to show on the 'finish' button (will default to 'Finish' in correct language)
 */

const props = defineProps({
  successMessage: String,
  nextMessage: String,
  buttonLabel: String,
  redirectPath: String,
  autoRedirect: Boolean,
  autoRedirectDurationMS: Number,
})

/**
 * Routes to  desired path - given through prop
 */
async function redirectOnClick(): Promise<void> {
  // Redirect to login page
  await $routerService.routeTo(ROUTES.redirectPath)
}

if (props.autoRedirect) {
  setTimeout(function () {
    $routerService?.routeTo(ROUTES.redirectPath)
  }, 5000);
}

</script>
