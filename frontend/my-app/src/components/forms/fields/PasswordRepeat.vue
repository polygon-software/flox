<template>
  <q-input
      dense
      label="Password"
      v-model="password"
      lazy-rules="ondemand"
      :type="isPwd ? 'password' : 'text'"
      :rules="[(val) => IS_VALID_PASSWORD(val) || $t('invalid_password')]"
  >
    <template v-slot:append>
      <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
      />
    </template>
  </q-input>
  <q-input
      dense
      label="Repeat Password"
      v-model="passwordRepeat"
      lazy-rules
      :type="isPwdReapeat ? 'password' : 'text'"
      :rules="[val => val === password || $t('non_matching_password')]"
  >
    <template v-slot:append>
      <q-icon
          :name="isPwdReapeat ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwdReapeat = !isPwdReapeat"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {IS_VALID_PASSWORD} from 'src/data/RULES';

/**
 * This component contains field to enter a new password, as well as another field to repeat the new password. Both entries need to match.
 */

let password = ref('')
let passwordRepeat = ref('')
const isPwd = ref(true)
const isPwdReapeat = ref(true)
</script>

<style scoped>
</style>
