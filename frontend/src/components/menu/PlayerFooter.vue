<template>
  <q-footer
    class="bg-primary shadow-5 row justify-center"
    style="height: 60px"
  >
    <div class="row justify-between" :style="'width: ' + (120 * navigationButtons.length).toString() + 'px'">
      <q-btn
        v-for="button in navigationButtons"
        :key="button.name"
        :icon="button.icon"
        :label="button.label"
        no-caps
        flat
        color="black"
        style="width: 120px"
      />
    </div>

  </q-footer>
</template>

<script setup lang="ts">
import {computed, inject, ref} from 'vue'
import {AuthenticationService} from 'src/services/AuthService';
import {RouterService} from 'src/services/RouterService';
import ROUTES from 'src/router/routes';
import {useAuth} from 'src/store/authentication';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';
import Inbox from 'components/notifications/Inbox.vue';


const $authService: AuthenticationService|undefined = inject('$authService')
const $routerService: RouterService|undefined = inject('$routerService')
const $authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()

// TODO i18n
const navigationButtons = [
  {
    name: 'start',
    label: 'Start',
    icon: 'home',
    action: () => goHome()
  },
  {
    name: 'bets',
    label: 'Your Bets',
    icon: 'local_activity',
    action: () => goHome() // TODO
  },
  {
    name: 'discover',
    label: 'Discover',
    icon: 'explore',
    action: () => goHome() // TODO
  },
  {
    name: 'community',
    label: 'Community',
    icon: 'groups',
    action: () => goHome() // TODO
  },
]

/**
 * TODO
 * @returns {void}
 */
function goHome(){
  // TODO
}

</script>
