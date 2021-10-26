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
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {IS_VALID_PASSWORD} from 'src/data/RULES';

/**
 * This component contains field to enter a new password.
 */

const password = ref('')
const isPwd = ref(true)

</script>

<style scoped>
</style>
