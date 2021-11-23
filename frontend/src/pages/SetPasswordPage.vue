<template>
  <q-page class="flex flex-center">
    <q-card class="square q-pa-md q-ma-md">
      <q-card-section>
        {{ $t('set_password_description')}}
      </q-card-section>
      <q-card-section>
        <PasswordRepeatField/>
<!--        <component-->
<!--          :is="field.component"-->
<!--          :key="field.key"-->
<!--          v-bind="field.attributes"-->
<!--          v-model="pw_value"-->
<!--          @change="(newValue) => updateValue(newValue)"-->
<!--        />-->
        <q-btn
          color="primary"
          label="submit"
          @click="submitPassword"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import PasswordRepeatField from '../components/forms/fields/company_signup/PasswordRepeatField.vue'

const field = FIELDS.PASSWORD_REPEAT

let pw_value = ""

function updateValue(value: string) {
  pw_value = value;
}

function submitPassword() {
  console.log("submit")
}

</script>

<style scoped>

</style>
