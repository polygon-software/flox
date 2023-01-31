<template>
  <FloxWrapper :module="MODULES.AUTH">
    <div class="column q-pa-sm text-center justify-center" style="margin: 50px">
      <GenericForm
        form-key="login"
        :pages="LoginFormPages"
        text-position="center"
        :finish-label="$t('buttons.login')"
        submit-on-enter
        @submit="onLogin"
      />
    </div>
    <div class="col q-mt-md">
      <q-btn
        :label="$t('authentication.forgot_password')"
        class="primary"
        flat
        dense
        no-caps
        style="text-decoration: underline"
        @click="forgotPassword"
      >
      </q-btn>
    </div>
  </FloxWrapper>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useQuasar } from 'quasar';

import { i18n } from 'boot/i18n';

import * as auth from '../..';
import { MODULES } from '../../../../MODULES';
import FloxWrapper from '../../../../core/components/FloxWrapper.vue';
import { showErrorNotification } from '../../../form/helpers/notification-helpers';
import LoginFormPages from '../../../form/data/form/LoginFormPages';
import { useFormStore } from '../../../form/stores/form';
import GenericForm from '../../../form/components/GenericForm.vue';
import AuthenticationService from '../../services/auth.service';

const $authService: AuthenticationService | undefined = inject('$authService');
const $q = useQuasar();
const store = useFormStore();

/**
 * Logs in the given authentication
 * @returns void
 */
async function onLogin(): Promise<void> {
  // Get data from store
  const identifier = store.data.login.loginPage.login[
    auth.moduleConfig().emailAsUsername ? 'email' : 'userName'
  ] as string;
  const password = store.data.login.loginPage.login.password as string;

  try {
    // Actually log in
    await $authService?.login(identifier, password);

    // Empty store state
    store.clearForm('login');
  } catch (e) {
    showErrorNotification($q, i18n.global.t('errors.login_failed'));
  }
}

/**
 * Triggers a password change for a non-logged in authentication
 * @returns void
 */
function forgotPassword(): void {
  $authService?.showResetPasswordDialog();
}
</script>
