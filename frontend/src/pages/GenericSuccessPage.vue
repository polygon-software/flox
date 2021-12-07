<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 600px">
      <q-card-section class="bg-white text-white flex flex-center q-pb-xs q-mb-xs q-mt-lg" style="height: 180px">
        <q-icon name="check_circle" size="150px" color="green" style="font-weight: 200;" items-center/>
      </q-card-section>

      <q-card-section style="height: 220px; text-align: center;" class="q-pt-xs q-mt-xs">
        <p class="text-h4 q-mb-xs">{{ successMessage }}</p>
        <p class="text-subtitle1">{{ furtherExplanation }}</p>
        <br/>
        <br/>
        <p v-if="autoRedirect">{{ nextMessage }}</p>
        <q-btn
          else
          color="blue"
          :label="buttonLabel"
          @click="redirectOnClick"/>
      </q-card-section>
    </q-card>
  </q-page>

</template>

<script setup lang="ts">
import {defineProps, inject} from 'vue';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {i18n} from 'boot/i18n';

const $routerService: RouterService = inject('$routerService')


/**
 * This component defines a generic error message that either has a redirect button or automatically redirects.
 * It takes the following properties:
 * @param {String} redirectPath - this is the redirect path of either the button or the automatic redirection
 * @param {Boolean} autoRedirect - boolean whether the user should be automatically redirected or not
 * @param {String} [successMessage] - Shows a quick success phrase (default is 'Hervorragend!' or 'Great!')
 * @param {String} [furtherExplanation] - a quick text (a sentence) to explain what was a success
 * @param {String} [nextMessage] - if it redirects automatically, this is the text that explains where it will redirect to
 * @param {String} [buttonLabel] - if it doesn't redirect automatically, this is the label of the button
 * @param {String} [autoRedirectDurationMS] - optional redirection duration length in milliseconds (default is 5000 milliseconds)
 */



const props = defineProps({
  redirectPath: {
    required: true,
    type: String,
  },
  autoRedirect: {
    required: true,
    type: Boolean,
  },
  successMessage: {
    required: false,
    type: String,
    default: i18n.global.t('success')
  },
  furtherExplanation: {
    required: false,
    type: String,
    default: i18n.global.t('successful_application')
  },
  nextMessage: {
    required: false,
    type: String,
    default: i18n.global.t('redirected')
  },
  buttonLabel: {
    required: false,
    type: String,
    default: i18n.global.t('back_to_login')
  },
  autoRedirectDurationMS: {
    required: false,
    type: Number,
    default: 5000
  },
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
  }, props.autoRedirectDurationMs);
}

</script>
