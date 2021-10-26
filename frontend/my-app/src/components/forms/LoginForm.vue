<template>
  <div class="column q-pa-sm" style="width: 250px; height: 430px;">
    <h5 class="q-ma-none" style="margin-bottom: 20px;">
      {{ $t('login') }}
    </h5>
    <q-form
        @submit="onSubmit"
        class="q-gutter-md"
    >
      <component
          v-for="field in fields"
          :key="field.key"
          :is="field.component"
          v-bind="field.attributes"
          v-model="form_values[field.key]"
          dense
      />
      <q-btn
          style="margin-top: 20px"
          color="primary"
          :label="$t('login')"
          type="submit"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {defineEmits} from "vue";
import {ref} from "vue";
import {FIELDS} from "@/data/FIELDS";

const fields = [FIELDS.USERNAME, FIELDS.PASSWORD]
let form_values = ref({})
const emit = defineEmits(['submit'])


/**
 * On submit, pass entered data outwards
 */
function onSubmit(){
  emit('submit', form_values)
}

</script>

<style scoped>

</style>
