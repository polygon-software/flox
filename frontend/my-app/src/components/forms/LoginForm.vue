<template>
  <div class="column q-pa-sm" style="width: 250px; height: 430px;">
    <h5 class="q-ma-none" style="margin-bottom: 20px;">
      {{ $t('login') }}
    </h5>
    <q-form
        @submit="form.onSubmit"
        class="q-gutter-md"
    >
      <component
          v-for="field in fields"
          :key="field.key"
          :is="field.component"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          @change="(newValue) => form.updateValue(field.key, newValue)"
      />
      <q-btn
          style="margin-top: 20px"
          color="primary"
          :label="$t('login')"
          type="submit"
          :disable="!form.pageValid.value"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'

const fields = [FIELDS.USERNAME, FIELDS.PASSWORD]

const form = new Form()
form.pages.value = [
  {
    key: 'login',
    label: 'Login',
    fields: fields
  }
]
</script>
