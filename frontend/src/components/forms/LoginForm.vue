<template>
  <div
    class="row q-pa-none justify-center"
    style="width: 300px"
  >
    <q-form
        @submit="onSubmit"
        class="row justify-center"
    >
      <component
          v-for="field in fields"
          :key="field.key"
          :is="field.component"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          @change="(newValue) => form.updateValue(field.key, newValue)"
          class="q-ma-md"
          style="width: 90%"
      />
      <q-btn
          style="margin-top: 20px"
          color="primary"
          text-color="black"
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
 */
function onSubmit(): void {
  emit('submit', form.values.value)
}
</script>
