<template>
  <q-page class="flex flex-center">
    <div
      class="column q-pa-sm"
      style="width: 500px;"
    >
      <GenericForm
        :finish-label="$t('set_password.ok')"
        :pages="pages"
        @submit="submitPassword"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
/**
 * this page lets you set a password using the SetPassword component
 */
import GenericForm from '../components/forms/GenericForm.vue';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {inject} from 'vue';
import { FIELDS } from 'src/data/FIELDS';
import {i18n} from 'boot/i18n';

const $routerService: RouterService|undefined = inject('$routerService')

const fields = [FIELDS.PASSWORD_REPEAT]

/**
 * pages used, here only one page with the RepeatPassword field
 */
const pages = [
  {
    key: 'password_repeat',
    label: i18n.global.t('set_password.description'),
    fields: fields,
  },
]

/**
 * submits the new password and redirects
 * @param event
 */
async function submitPassword(event: Record<string, string>) {
  console.log('new password', event.password_repeat)
  setTimeout(function() {$routerService?.routeTo(ROUTES.MANAGEMENT_DASHBOARD)}, 5000);
  await $routerService?.routeTo(ROUTES.SUCCESS)
}
</script>

<style scoped>

</style>
