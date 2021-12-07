<template>
  <q-page
    style="display:flex; flex-direction: column"
  >
    <!-- Top row: title + add button -->
    <div
      class="row full-width justify-between q-pa-md"
      style="height: 20px"
    >
      <!-- TODO styling, language-->
      <h6 class="q-ma-none">{{ $t('settings') }}</h6>
    </div>
    <!-- Body: Table with tabs etc. -->
    <div
      class="column full-height items-start q-pa-md full-width"
    >

      <q-btn
        v-if="loggedIn"
        :label="$t('authentication.change_password')"
        class="text-black"
        flat
        type="vertical"
        @click="changePassword"
      />
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {AuthenticationService} from 'src/services/AuthService';
import {computed, inject} from 'vue';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';
import {useAuth} from 'src/store/authentication';

const $authService: AuthenticationService|undefined = inject('$authService')
const $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

const loggedIn = computed(() => {
  // Explicit type
  const result: boolean = $authStore.getters.getLoggedInStatus()
  return result;
})

/**
 * Triggers a password change for the currently logged in authentication
 */
function changePassword() {
  $authService?.showChangePasswordDialog()
}
</script>
