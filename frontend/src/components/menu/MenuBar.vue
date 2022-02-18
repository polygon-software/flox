<template>
  <q-header class="row bg-black shadow-5 justify-between">
    <h5 class="text-white q-pa-none q-ma-md">
      Strategic Opportunity Investments
    </h5>
    <q-btn-dropdown
        dropdown-icon="more_vert"
        auto-close
        no-icon-animation
        flat
        round
        dense
        style="margin-right: 4px"
        @click="showOptions = !showOptions"
      >
        <div class="column">
          <q-btn
            v-if="loggedIn"
            :label="$t('authentication.logout')"
            class="text-black"
            flat
            no-caps
            @click="logout"
          />

          <q-btn
            v-if="loggedIn"
            :label="$t('authentication.change_password')"
            class="text-black"
            flat
            no-caps
            @click="changePassword"
          />
        </div>
    </q-btn-dropdown>
  </q-header>
</template>

<script setup lang="ts">
import {computed, inject} from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import {useAuth} from 'src/store/authentication';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';

const $authService: AuthenticationService|undefined = inject('$authService')
const $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

const loggedIn = computed(() => {
  return $authStore.getters.getLoggedInStatus()
})


/**
 * Logs out the current authentication
 * @returns {Promise<void>} - done
 */
async function logout(): Promise<void>{
  await $authService?.logout();
}

/**
 * Triggers a password change for the currently logged in authentication
 * @returns {void}
 */
function changePassword() {
  $authService?.showChangePasswordDialog()
}

</script>
