<template>
  <q-page
    style="display:flex; flex-direction: column"
  >
    <!-- Top row: title + add button -->
    <div
      class="row full-width justify-between q-pa-md"
      style="height: 20px"
    >
      <h6 class="q-ma-none">{{ $t('settings.settings') }}</h6>
    </div>
    <!-- Body: Settings list -->
    <div
      class="column full-height items-start q-pa-md full-width"
      style="margin-top: 12px"
    >
      <q-list
        bordered
        padding
        class="full-width bg-white"
      >
        <q-item-label header>{{ $t('settings.account') }}</q-item-label>

        <q-item
          v-ripple
          clickable
          @click="changePassword"
        >
          <q-item-section>
            <q-item-label>{{ $t('authentication.change_password') }}</q-item-label>
            <q-item-label caption>
              TODO a description goes here.
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item-label header>{{ $t('settings.general') }}</q-item-label>

        <q-item v-ripple tag="label">
          <q-item-section side top>
            <q-checkbox v-model="check1" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Notifications</q-item-label>
            <q-item-label caption>
              Notify me about updates to apps or games that I downloaded
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple tag="label">
          <q-item-section side top>
            <q-checkbox v-model="check2" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Sound</q-item-label>
            <q-item-label caption>
              Auto-update apps at anytime. Data charges may apply
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple tag="label">
          <q-item-section side top>
            <q-checkbox v-model="check3" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Auto-add widgets</q-item-label>
            <q-item-label caption>
              Automatically add home screen widgets
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item-label header>Notifications</q-item-label>

        <q-item v-ripple tag="label">
          <q-item-section>
            <q-item-label>Battery too low</q-item-label>
          </q-item-section>
          <q-item-section side >
            <q-toggle v-model="notif1" color="blue" val="battery" />
          </q-item-section>
        </q-item>

        <q-item v-ripple tag="label">
          <q-item-section>
            <q-item-label>Friend request</q-item-label>
            <q-item-label caption>Allow notification</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle v-model="notif2" color="green" val="friend" />
          </q-item-section>
        </q-item>

        <q-item v-ripple tag="label">
          <q-item-section>
            <q-item-label>Picture uploaded</q-item-label>
            <q-item-label caption>Allow notification when uploading images</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle v-model="notif3" color="red" val="picture" />
          </q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item-label header>Other settings</q-item-label>

        <q-item>
          <q-item-section side>
            <q-icon color="teal" name="volume_down" />
          </q-item-section>
          <q-item-section>
            <q-slider
              v-model="volume"
              :min="0"
              :max="10"
              label
              color="teal"
            />
          </q-item-section>
          <q-item-section side>
            <q-icon color="teal" name="volume_up" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-icon color="deep-orange" name="brightness_medium" />
          </q-item-section>
          <q-item-section>
            <q-slider
              v-model="brightness"
              :min="0"
              :max="10"
              label
              color="deep-orange"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-icon color="primary" name="mic" />
          </q-item-section>
          <q-item-section>
            <q-slider
              v-model="mic"
              :min="0"
              :max="50"
              label
            />
          </q-item-section>
        </q-item>
      </q-list>
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
