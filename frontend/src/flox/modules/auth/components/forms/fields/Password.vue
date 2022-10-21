<template>
  <q-input
    v-model="password"
    dense
    :label="$t('authentication.password')"
    lazy-rules="ondemand"
    :type="isPwd ? 'password' : 'text'"
    :rules="passwordRules"
  >
    <template #prepend>
      <q-icon name="lock" size="xs" color="grey" />
    </template>
    <template #append>
      <q-icon
        :name="isPwd ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        color="grey"
        @click="isPwd = !isPwd"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {joiPasswordSchema, joiSchemaToValidationRule} from 'src/tools/validation.tool';
import { useI18n } from 'vue-i18n';
/**
 * This component contains field to enter a password.
 */

const password = ref('')
const isPwd = ref(true)

const { t } = useI18n();

const passwordRules = [joiSchemaToValidationRule(joiPasswordSchema(), t('errors.invalid_password'))]


</script>
