<template>
  <q-page class="flex flex-center">
    <q-card class="square q-pa-md q-ma-md">

      <q-card-section
        class="col"
      >
        <div
          class="column q-pa-sm flex-center"
          style="width: 600px; text-align: center;"
        >
          <h5 class="q-ma-none" style="width: 300px; align-self: center; margin-bottom: 20px;">
            {{ $t('authentication.reset_password') }}
          </h5>
          <p class="q-ma-none" style="width: 300px; align-self: center; margin-bottom: 20px;">
            {{ $t('authentication.enter_new_password') }}
          </p>
          <q-form
            class="q-gutter-md"
            style="width: 300px; align-self: center"
            @submit="onReset"
          >
            <q-input
              v-model="verificationCode"
              :label="$t('authentication.email_verification_code')"
            />
            <q-input
              v-model="password"
              :label="$t('authentication.new_password')"
              type="password"
              :rules="[passwordRules]"
            />
            <q-input
              v-model="passwordRep"
              :label="$t('authentication.new_password_repeated')"
              type="password"
              :rules="[
                val => val === password || $t('errors.identical_password'),
                ]"
            />
          </q-form>
          <div style="display: flex; flex-direction: row; margin-top: 20px;">
            <q-btn
              no-caps
              :label="$t('buttons.cancel')"
              class="text-primary"
              flat
              @click="onCancel"
            />
            <q-btn
              color="primary"
              :label="$t('buttons.confirm_change')"
              :disable="password !== passwordRep || verificationCode.length !== 6"
              @click="onReset"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {inject, ref,} from 'vue'
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {PASSWORD_MIN_LENGTH, PASSWORD_REGEX} from 'src/helpers/REGEX'
import {i18n} from 'boot/i18n';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';
import {useAuth} from 'src/store/authentication';

const verificationCode = ref('')
const password = ref('')
const passwordRep = ref('')

const $routerService: RouterService|undefined = inject('$routerService')
const $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

/**
 * Rules for validation of password
 * @param {string} val - the password
 * @returns {boolean|string} - success (true), or an error message
 */
const passwordRules = (val: string) => {
  if (!PASSWORD_MIN_LENGTH.test(val)) {
    return i18n.global.t('errors.password_too_short')
  } else if (!PASSWORD_REGEX.test(val)){
    // must contain at least one of each: lower-, and an uppercase letter, a digit, and a special character
    return i18n.global.t('errors.password_missing')
  }
  return true
}

/**
 * Resets the password and routes back to the Login Page
 * @returns {Promise<void>} - done
 */
async function onReset(): Promise<void>{
  $authStore.getters.getCognitoUser()?.confirmPassword(verificationCode.value,password.value,{
    onSuccess: (result: unknown)=>{console.log(result)},
    onFailure: (err: Error) => {console.log(err)}
  })
  await $routerService?.routeTo(ROUTES.LOGIN)
}


/**
 * Routes back to the Login Page
 * @returns {Promise<void>} - done
 */
async function onCancel(): Promise<void>{
  await $routerService?.routeTo(ROUTES.LOGIN)
}

</script>
