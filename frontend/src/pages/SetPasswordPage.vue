<template>
  <q-page class="flex flex-center">
    <q-card class="square q-pa-md q-ma-md">
      <q-card-section>
        {{ $t('set_password_description')}}
      </q-card-section>


      <q-card-section>
        <q-form
          class="q-gutter-md"
          @submit="onSubmit"
        >
          <q-input
            v-model="password"
            :label="$t('password')"
            :type="isPwd ? 'password' : 'text'"
            :rules="[val => PASSWORD_REGEX.test(val) || 'Not ok']"
          >
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            v-model="passwordRep"
            :label="$t('repeat_password')"
            :type="isPwdRepeat ? 'password' : 'text'"
            :rules="[val => val === password || 'Passwords must be identical']"
          >
            <template #append>
              <q-icon
                :name="isPwdRepeat ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdRepeat = !isPwdRepeat"
              />
            </template>
          </q-input>
          <q-card-actions align="center">
            <q-btn
              color="primary"
              label="OK"
              :disable="password !== passwordRep"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>


      <q-card-section>
        <PasswordRepeatField @change="change_pw"/>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          color="primary"
          label="OK"
          @click="submitPassword"
        />
      </q-card-actions>


    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import PasswordRepeatField from '../components/forms/fields/company_signup/PasswordRepeatField.vue'
import {ref} from 'vue';
import {PASSWORD_REGEX} from 'src/helpers/REGEX';

let password = ref('')
let passwordRep = ref('')
const isPwd = ref(true)
const isPwdRepeat = ref(true)
let newPwd = ''

function onSubmit(){
  console.log(password.value, password)
}

function change_pw(event: string) {
  newPwd = event
  console.log(newPwd)
}

function submitPassword() {
  console.log(newPwd)
}

</script>

<style scoped>

</style>
