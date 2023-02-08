<template>
  <q-page class="flex flex-center column">
    <!-- Signup Card -->
    <q-card class="q-pa-md q-ma-md" style="width: 300px">
      <SignupForm @submit="onSignup" @cancel="onCancel" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { inject } from 'vue';

import { i18n } from 'boot/i18n';
import SignupForm from 'src/flox/modules/auth/components/forms/SignupForm.vue';
import ROUTES from 'src/router/routes';
import RouterService from 'src/services/RouterService';
import { showSuccessNotification } from 'src/tools/notification.tool';
import { showErrorNotification } from 'src/flox/modules/form/helpers/notification-helpers';

import AuthenticationService from '../flox/modules/auth/services/auth.service';

const $q = useQuasar();
const $authService: AuthenticationService | undefined = inject('$authService');
const $routerService: RouterService | undefined = inject('$routerService');

/**
 * Logs in the given authentication
 *
 * @param user - user signup args
 * @param user.username - the authentication's username (might be identical to the e-mail)
 * @param user.email - the authentication's email
 * @param user.password - the authentication's password
 * @param user.language - the user's selected language
 */
async function onSignup({
  username,
  email,
  password,
  language,
}: {
  username: string;
  email: string;
  password: string;
  language?: string;
}): Promise<void> {
  try {
    await $authService?.signUp(username, email, password, language);
    // Show success notification
    showSuccessNotification($q, i18n.global.t('messages.account_created'));

    // Redirect to login page
    await $routerService?.routeTo(ROUTES.LOGIN);
  } catch (e) {
    showErrorNotification($q, i18n.global.t('errors.account_creation_failed'));
    console.error(e);
  }
}

/**
 * On cancel, routes back to login page
 */
async function onCancel(): Promise<void> {
  await $routerService?.routeTo(ROUTES.LOGIN);
}
</script>
