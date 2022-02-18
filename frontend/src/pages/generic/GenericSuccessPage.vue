<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 600px">
      <q-card-section class="bg-white text-white flex flex-center q-pb-xs q-mb-xs q-mt-lg" style="height: 180px">
        <q-icon name="check_circle" size="150px" color="green" style="font-weight: 200;" items-center/>
      </q-card-section>

      <q-card-section style="height: 220px; text-align: center;" class="q-pt-xs q-mt-xs">
        <p class="text-h4 q-mb-xs">{{ $t('messages.success') }}</p>
        <p class="text-subtitle1">{{ message }}</p>
        <br/>
        <br/>
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
import {inject} from 'vue';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {i18n} from 'boot/i18n';
import {RouteRecordRaw, useRoute} from 'vue-router';

const $routerService: RouterService|undefined = inject('$routerService')
const route = useRoute()

/**
 * This component defines a generic success message that has a redirect button and automatically redirects.
 * It optionally takes the following properties via URL:
 * @param {String} [target] - redirect target route
 * @param {String} [msg] - success message to show
 * @param {String} [btn] - label of the button
 */


const query = route.query

// Get parameters from route query (if any), or use default
const target: RouteRecordRaw = query.target ? ROUTES[(query.target.toString()).toUpperCase()] : ROUTES.LOGIN
const message = query.msg ?  i18n.global.t(query.msg) : i18n.global.t('authentication.successful_application')
const buttonLabel = query.btn ?  i18n.global.t(query.btn) : i18n.global.t('authentication.back_to_login')
const autoRedirectDurationMS = 5000


/**
 * Routes to  desired path - given through URL query
 * @returns {Promise<void>} - done
 */
async function redirectOnClick(): Promise<void> {
  // Redirect to login page
  await $routerService?.routeTo(target)
}

// Set up auto-redirect
setTimeout(function () {
  void $routerService?.routeTo(target)
}, autoRedirectDurationMS);


</script>
