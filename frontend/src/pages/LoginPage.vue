<template>
  <div class="blurred-background"></div>
  <q-page class="flex flex-center column bg-gradient">
    <!-- Login Card -->
    <q-card class="login-container" flat>
      <div class="row" style="height: 100%; align-items: stretch">
        <div class="col-7 color-container gt-sm">
          <!-- https://undraw.co/search make sure to change color on webpage to primary -->
          <img
            src="../assets/images/undraw_working_re_ddwy.svg"
            alt="welcome graphics"
          />
          <h4>{{ $t('authentication.welcome_back') }}</h4>
          <p>{{ $t('authentication.welcome_text') }}</p>
        </div>
        <div class="col-12 col-md-5 form-container q-px-lg">
          <LoginForm @submit="onLogin" />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useQuasar } from 'quasar';

import LoginForm from 'src/flox/modules/auth/components/forms/LoginForm.vue';

import AuthenticationService from '../flox/modules/auth/services/auth.service';

const $authService: AuthenticationService | undefined = inject('$authService');
const $q = useQuasar();

/**
 * Logs in the given authentication
 *
 * @param user - user args
 * @param user.identifier - the authentication's username or e-mail
 * @param user.password - the authentication's password
 */
async function onLogin({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}): Promise<void> {
  await $authService?.login(identifier, password, $q);
}
</script>

<style scoped lang="scss">
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
.login-container {
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
