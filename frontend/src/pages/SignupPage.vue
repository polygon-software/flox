<template>
  <div class="blurred-background"></div>
  <q-page class="flex flex-center column bg-gradient">
    <!-- Signup Form Card -->
    <q-card class="signup-container" flat>
      <div
        class="row justify-center"
        style="height: 100%; align-items: stretch"
      >
        <div class="col-12 col-md-5 form-container q-px-lg">
          <SignupForm @cancel="onCancel" @submit="onSignup" />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
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
 * @param user.lang - the user's selected language
 */
async function onSignup({
  username,
  email,
  password,
  lang,
}: {
  username: string;
  email: string;
  password: string;
  lang?: string;
}): Promise<void> {
  try {
    await $authService?.signup(username, email, password, lang);
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

<style lang="scss" scoped>
.blurred-background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-image: url('../assets/images/zurich.jpg');
  filter: blur(64px);
  -webkit-filter: blur(64px);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.bg-gradient {
  background: #388087; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    left,
    rgba(56, 128, 135, 0.5),
    rgba(194, 237, 206, 0.5)
  );
  background: linear-gradient(
    to left,
    rgba(56, 128, 135, 0.5),
    rgba(194, 237, 206, 0.5)
  );
}

.signup-container {
  width: 800px;
  max-width: calc(100% - 20px);
  height: 500px;
  border-radius: 25px;
  overflow: hidden;
}

.color-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: $secondary;
  padding: 0 40px;

  img {
    max-width: 60%;
  }

  h4 {
    color: white;
    margin-top: 80px;
    margin-bottom: 10px;
  }

  p {
    color: white;
    font-weight: 300;
  }
}

.form-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
