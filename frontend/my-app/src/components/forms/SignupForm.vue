<template>
  <div class="q-pa-sm">
    <h5 class="q-ma-none" style="margin-bottom: 20px;">
      {{ $t('signUp') }}
    </h5>
    <q-form
        @submit="onSubmit"
        class="q-gutter-md"
        >
    <q-stepper
        v-model="step"
        ref="stepper"
        animated
        active-color="primary"
        transition-duration="1000"
    >
      <q-step
          v-for="(page, index) in pages"
          :key="page.key"
          :name="index+1"
          :prefix="index+1"
          :title="page.label"
      >
        <component
              v-for="field in page.fields"
              :key="field.key"
              :is="field.component"
              v-bind="field.attributes"
              v-model="inputs[field.key]"
              dense
          />
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
              v-if="step > 1"
              @click="$refs.stepper.previous()"
              flat
              style="margin-right: 30px"
              color="primary"
              label="Back" class="q-ml-sm" />
          <q-btn
              v-if="step < pages.length"
              @click="$refs.stepper.next()"
              color="primary"
              label="Continue"
          />
          <q-btn
              v-if="step === pages.length"
              color="primary"
              :label="$t('Finish')"
              type="submit"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {ref, defineEmits} from "vue";
import {SIGNUP} from "@/components/forms/FIELDS";

const account_fields = [SIGNUP.EMAIL, SIGNUP.USERNAME, SIGNUP.PASSWORD_REPEAT]
const pages = [
  {
    key: "account_data",
    label: "Account",
    fields: account_fields,
  },
  {
    key: "personal_data",
    label: "Account",
    fields: [],
  },
  {
    key: "address_data",
    label: "Address",
    fields: [],
  },
  {
    key: "authentication",
    label: "Authentication",
    fields: [],
  },
  {
    key: "interests",
    label: "Interests",
    fields: [],
  },
  {
    key: "personal_data",
    label: "Account",
    fields: [],
  }
]

let step = ref(1)
let inputs = ref({})

const emit = defineEmits(['submit'])


/**
 * TODO
**/
function onSubmit(){
  emit('submit', inputs)
  console.log("hello")
}

</script>

<style scoped>

</style>
