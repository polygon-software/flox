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
            {{ $t('authentication.reset_password_text') }}
          </p>
          <q-form
            class="q-gutter-md"
            style="width: 300px; align-self: center"
            @submit="onReset"
          >
            <component
              :is="field.component"
              v-for="field in fields"
              :key="field.key"
              v-bind="field.attributes"
              v-model="form.values.value[field.key]"
              type="text"
              @change="(newValue) => form.updateValue(field.key, newValue)"
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
              :label="$t('authentication.reset_password')"
              :disable="form.values.value[field.key].length === 0"
              @click="onReset(form.values.value[field.key])"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import {inject} from 'vue'
import ROUTES from 'src/router/routes';
import {RouterService} from 'src/services/RouterService';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';
import {useAuth} from 'src/store/authentication';

const $routerService: RouterService|undefined = inject('$routerService')


const fields = [FIELDS.EMAIL]

const form = new Form()
form.pages.value = [
  {
    key: 'reset',
    label: 'Reset',
    fields: fields
  }
]

const $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()
/**
 * Routes to the Reset Password 2 Page
 * @returns {Promise<void>} - done
 */
async function onReset(username: string): Promise<void>{
  // Set up cognitoUser first
  $authStore.mutations.setCognitoUser(new CognitoUser({
    Username: username,
    Pool: $authStore.getters.getUserPool()
  }));
  // Call forgotPassword on cognitoUser
  $authStore.getters.getCognitoUser()?.forgotPassword({
    onSuccess: function() {
      // TODO
    },
    onFailure: (err: Error) => {
      $authStore.mutations.setCognitoUser(undefined);
    },
  });
  await $routerService?.routeTo(ROUTES.RESET_PASSWORD2)
}


/**
 * Routes to the Login Page
 * @returns {Promise<void>} - done
 */
async function onCancel(): Promise<void>{
  await $routerService?.routeTo(ROUTES.LOGIN)
}

</script>
