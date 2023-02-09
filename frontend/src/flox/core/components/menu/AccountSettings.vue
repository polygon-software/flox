<template>
  <q-card class="justify-center" style="width: 600px" flat bordered>
    <!-- Settings -->
    <q-list class="full-width" bordered separator>
      <!-- Change Password -->
      <q-item>
        <q-item-section>
          <h5>
            {{ $t('authentication.change_password') }}
          </h5>
          <q-item-label>
            {{
              $t('authentication.reset_password_description', {
                email: currentUser?.email,
              })
            }}
          </q-item-label>
          <q-btn
            :label="$t('buttons.request_code')"
            :class="`${DEFAULT_BUTTON_CLASS} q-my-md`"
            :style="`${DEFAULT_BUTTON_STYLE}; width: 200px`"
            :disable="!isActive"
            unelevated
            outline
            @click="sendResetPasswordLink"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeMount, Ref, ref } from 'vue';

import {
  DEFAULT_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
  DEFAULT_CARD_STYLE,
} from '../../../../css/defaultStyles';
import User from '../../../modules/auth/entities/user.entity';
import AuthenticationService from '../../../modules/auth/services/auth.service';
import { fetchMyUser } from '../../../modules/auth/services/user.service';

const $authService: AuthenticationService | undefined = inject('$authService');
const currentUser: Ref<User | null> = ref(null);
const loading = ref(true);

onBeforeMount(async () => {
  currentUser.value = await fetchMyUser();
});

// Whether the button to request the verification code is active
const isActive = computed(() => {
  return !loading.value || !!currentUser.value?.email;
});

/**
 * Sends a link to the users registered e-mail address, so they can set a new password
 * @return void
 */
function sendResetPasswordLink(): void {
  loading.value = true;
  if (currentUser.value && currentUser.value?.email) {
    $authService?.showRequestNewPasswordDialog(currentUser.value?.email);
  }
  loading.value = false;
}
</script>
