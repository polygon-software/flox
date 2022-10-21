<template>
  <q-input
    v-model="password"
    dense
    :label="$t('authentication.password')"
    lazy-rules="ondemand"
    :type="isPwd ? 'password' : 'text'"
    :rules="passwordRules"
  >
    <template #append>
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
import {joiPasswordSchema, joiSchemaToValidationRule} from 'src/tools/validation.tool';
import {i18n} from 'boot/i18n.boot';

/**
 * This component contains field to enter a password.
 */

const password = ref('')
const isPwd = ref(true)

const passwordRules = [joiSchemaToValidationRule(joiPasswordSchema(), i18n.global.t('errors.invalid_password'))]


</script>
