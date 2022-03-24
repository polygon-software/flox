<template>
  <div class="q-pa-md">
    <q-card-section>
      <p>{{ $t('account_data.email') }}</p>
      <div style="display: flex">
        <q-input
          v-model="email"
          dense
          label=""
          type="email"
          :rules="[(val) => IS_EMAIL(val) || $t('errors.invalid_email')]"
          lazy-rules="ondemand"
          :outlined="editingEmail"
          :borderless="!editingEmail"
          :disable="!editingEmail"
          style="width: 250px; padding: 0; margin-right: 10px"
        />
        <q-btn
          style="width: 165px; height: 40px"
          :label="!editingEmail ? $t('buttons.edit') : $t('buttons.save')"
          outline
          class="text-grey"
          :disable="!IS_EMAIL(email)"
          @click="onSaveEmail"
        />
      </div>
    </q-card-section>
    <q-card-section>
      <p>{{ $t('account_data.username') }}</p>
      <div style="display: flex">
        <q-input
          v-model="username"
          dense
          label=""
          type="text"
          :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_username')]"
          :lazy-rules="true"
          :outlined="editingUsername"
          :borderless="!editingUsername"
          :disable="!editingUsername"
          style="width: 250px; padding: 0; margin-right: 10px"
        />
        <q-btn
          style="width: 165px; height: 40px"
          :label="!editingUsername ? $t('buttons.edit') : $t('buttons.save')"
          outline
          class="text-grey"
          :disable="!IS_VALID_STRING(username)"
          @click="onSaveUsername"
        />
      </div>
    </q-card-section>
    <q-card-section>
      <p>{{ $t('account_data.password')}}</p>
      <div style="display: flex">
        <q-field borderless stack-label style="width: 250px; padding: 0; margin-right: 10px">
          <template #control>
            <div class="self-center full-width no-outline" tabindex="0">********</div>
          </template>
        </q-field>
        <q-btn
          style="width: 165px; height: 40px"
          :label="$t('account_data.change_password')"
          outline
          class="text-grey"
          @click="onChangePassword"
        />
      </div>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        color="primary"
        :label="$t('buttons.finish')"
        :disable="!saveChanges"
        unelevated
        @click="onSubmit"
      />
    </q-card-actions>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, inject, ref, Ref, watchEffect } from 'vue';
import { IS_EMAIL, IS_VALID_STRING } from 'src/data/RULES'
import {AuthenticationService} from 'src/services/AuthService';
import {Context, Module} from 'vuex-smart-module';
import AuthState from 'src/store/authentication/state';
import AuthGetters from 'src/store/authentication/getters';
import AuthMutations from 'src/store/authentication/mutations';
import AuthActions from 'src/store/authentication/actions';
import {useAuth} from 'src/store/authentication';
import {ErrorService} from 'src/services/ErrorService';
import { myUser } from 'src/helpers/api-helpers';

const authStore: Context<Module<AuthState, AuthGetters, AuthMutations, AuthActions>> = useAuth()
const authService: AuthenticationService|undefined = inject('$authService')

const user = myUser()
const stop = watchEffect(() => {
  if(user.value){
    email.value = user.value.email
    stop()
  }
})
const username: Ref<string | undefined> = ref(authStore.getters.getUsername())
const email = ref('')


const emit = defineEmits(['submit'])

const editingEmail = ref(false)
const editingUsername = ref(false)
const saveChanges = ref(false)

const $errorService: ErrorService|undefined = inject('$errorService')

/**
 * Changes the disable value of the button
 * @returns {void}
 */
function onSaveEmail(){
  editingEmail.value = !editingEmail.value
  saveChanges.value = true
}

/**
 * Changes the disable value of the button
 * @returns {void}
 */
function onSaveUsername(){
  editingUsername.value = !editingUsername.value
  saveChanges.value = true
}

/**
 * Emits the 'submit' event, containing the form's data
 * @returns {void}
 */
function onSubmit(): void {
  if (username.value === undefined || !username.value || username.value.length === 0){
    $errorService?.showErrorDialog(new Error('Change the username data failed because it is undefined. You have to enter a username'))
  }
  emit('submit', {email: email.value, username: username.value})
}

/**
 * Triggers a password change for a logged in user
 * @returns {void}
 */
function onChangePassword() {
  authService?.showChangePasswordDialog();
}

</script>
