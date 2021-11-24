<template>
  <q-form
    class="q-gutter-md"
    @submit="onSubmit"
  >
    <q-input
      v-model="password"
      :label="$t('set_password.password')"
      :type="isPwd ? 'password' : 'text'"
      :rules="[val => PASSWORD_REGEX.test(val) || $t('set_password.password_invalid')]"
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
      :label="$t('set_password.repeat_password')"
      :type="isPwdRepeat ? 'password' : 'text'"
      :rules="[val => val === password || $t('set_password.passwords_not_matching')]"
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
        :label="$t('set_password.ok')"
        :disable="(password !== passwordRep)  || !PASSWORD_REGEX.test(password)"
        type="submit"
      />
    </q-card-actions>
  </q-form>
</template>

<script setup lang="ts">
import {defineEmits, ref} from 'vue';
import {PASSWORD_REGEX} from 'src/helpers/REGEX';

let password = ref('')
let passwordRep = ref('')
const isPwd = ref(true)
const isPwdRepeat = ref(true)
const emit = defineEmits(['submit'])

/**
 * emits a submit event with the new password upon clicking the submit button
 */
function onSubmit(){
  emit('submit', password.value)
}

</script>

<style scoped>

</style>
