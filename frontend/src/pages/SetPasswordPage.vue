<template>
  <q-page class="flex flex-center">
    <div
      class="column q-pa-sm"
      style="width: 500px;"
    >
      <GenericForm
        :finish-label="$t('buttons.ok')"
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
import {useAuth} from 'src/store/authentication';
import {useRoute} from 'vue-router';
import {ErrorService} from 'src/services/ErrorService';
import {AuthenticationService} from 'src/services/AuthService';

const $authStore = useAuth()
const $routerService: RouterService|undefined = inject('$routerService')
const $errorService: ErrorService|undefined = inject('$errorService')
const $authService: AuthenticationService = inject('$authService')

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

// Get one-time signin parameters from URL query
const route = useRoute()
const username: string|undefined = route.query.u?.toString()
const password: string|undefined = route.query.k?.toString()
const type: string|undefined = route.query.t?.toString()

/**
 * submits the new password and redirects
 * @param {Record<string, string>} values - the form's values
 */
async function submitPassword(values: Record<string, string>) {

  console.log('set called for', username, 'with pw', password)

  if(username === undefined || password === undefined){
    $errorService?.showErrorDialog(new Error('Invalid link')) // TODO i18n
    return
  }

  console.log('set called for', username, 'with pw', password)

  // Log in
  await $authService.login(username, password)

  // Change password
  $authStore.getters.getCognitoUser()?.changePassword(password, values.password_repeat, (err: Error|undefined)=>{
    if(err){
      $errorService?.showErrorDialog(err)
    }
  })

  setTimeout(function() {$routerService?.routeTo(type === 'man' ? ROUTES.MANAGEMENT_DASHBOARD : ROUTES.EMPLOYEE_DASHBOARD)}, 5000);
  await $routerService?.routeTo(ROUTES.SUCCESS)
}
</script>

<style scoped>

</style>
