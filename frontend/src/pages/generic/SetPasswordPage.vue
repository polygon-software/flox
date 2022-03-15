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
import GenericForm from 'components/forms/GenericForm.vue';
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {inject} from 'vue';
import { FIELDS } from 'src/data/FIELDS';
import {i18n} from 'boot/i18n';
import {useAuth} from 'src/store/authentication';
import {useRoute} from 'vue-router';
import {ErrorService} from 'src/services/ErrorService';
import {AuthenticationService} from 'src/services/AuthService';
import {ROLE} from 'src/data/ENUM/ENUM';

const $authStore = useAuth()
const $routerService: RouterService|undefined = inject('$routerService')
const $errorService: ErrorService|undefined = inject('$errorService')
const $authService: AuthenticationService|undefined = inject('$authService')

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
 * @returns {void}
 */
async function submitPassword(values: Record<string, string>) {

  if(username === undefined || password === undefined || type === undefined){
    $errorService?.showErrorDialog(new Error(i18n.global.t('errors.invalid_link')))
    return
  }
  const decodedEmail = atob(username)
  const decodedPw = atob(password)

  // Log in
  await $authService?.login(decodedEmail, decodedPw, values.password_repeat)


  let target;
  switch(type){
    case ROLE.EMPLOYEE:
      target = 'EMPLOYEE_DASHBOARD'
      break;
    case ROLE.SOI_EMPLOYEE:
      target = 'APPLICATIONS'
      break;
    case ROLE.COMPANY:
      target = 'MANAGEMENT_EMPLOYEE_DATA'
      break;
    default:
      target = 'WILDCARD' // Should never happen; redirect to 404 page
      return;
  }
  await $routerService?.routeTo(ROUTES.SUCCESS, {
    msg: 'messages.password_set',
    btn: 'buttons.to_dashboard',
    target: target,
  })
}
</script>

<style scoped>

</style>
