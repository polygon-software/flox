<template>
  <div
    class="row q-pa-none justify-center"
    style="width: 300px"
  >
    <q-form
        class="row justify-center"
        @submit="onSubmit"
    >
      <component
          :is="field.component"
          v-for="field in fields"
          :key="field.key"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          class="q-ma-none"
          style="width: 90%"
          @change="(newValue) => form.updateValue(field.key, newValue)"
      />
      <q-btn
          style="margin-top: 20px"
          color="primary"
          text-color="black"
          :label="$t('authentication.login')"
          type="submit"
          rounded
          :disable="!form.pageValid.value"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {FIELDS} from 'src/data/FIELDS';
import { Form } from 'src/helpers/form-helpers'
import {defineEmits} from 'vue';

const emit = defineEmits(['submit'])

const fields = [FIELDS.USERNAME, FIELDS.PASSWORD]

const form = new Form()
form.pages.value = [
  {
    key: 'login',
    label: 'Login',
    fields: fields
  }
]

/**
 * Emits the 'submit' event, containing the form's data
 * @returns {void}
 */
function onSubmit(): void {
  emit('submit', form.values.value)
}
</script>
