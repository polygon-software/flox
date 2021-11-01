<template>
  <div class="column q-pa-sm" style="width: 250px; height: 430px;">
    <h5 class="q-ma-none" style="margin-bottom: 20px;">
      {{ $t('login') }}
    </h5>
    <q-form
        @submit="signinForm.onSubmit"
        class="q-gutter-md"
    >
      <component
          v-for="field in fields"
          :key="field.key"
          :is="field.component"
          v-bind="field.attributes"
          v-model="signinForm.values.value[field.key]"
          @change="(newValue) => signinForm.updateValue(field.key, newValue)"
      />
      <q-btn
          style="margin-top: 20px"
          color="primary"
          :label="$t('login')"
          type="submit"
          :disable="!signinForm.pageValid.value"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import * as signinForm from 'src/helpers/form-helpers'

const fields = [FIELDS.USERNAME, FIELDS.PASSWORD]
signinForm.pages.value = [
  {
    key: 'login',
    label: 'Login',
    fields: fields
  }
]
</script>
