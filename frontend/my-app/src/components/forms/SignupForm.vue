<template>
  <div class="q-pa-sm">
    <h5 class="q-ma-none" style="margin-bottom: 30px;">
      {{ $t('signup') }}
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
        done-icon="done"
    >
      <q-step
          v-for="(page, index) in pages"
          :key="page.key"
          :name="index+1"
          :prefix="index+1"
          :title="page.label"
          :done="step > index"
      >
        <component
              v-for="field in page.fields"
              :key="field.key"
              :is="field.component"
              v-bind="field.attributes"
              v-model="form_values[field.key]"
              @change="(newValue) => updateValue(newValue, field.key)"
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
              :label="$t('back')"
              class="q-ml-sm" />
          <q-btn
              v-if="step < pages.length"
              @click="$refs.stepper.next()"
              color="primary"
              :label="$t('next_step')"
              :disable="!validFields"
          />
          <q-btn
              v-if="step === pages.length"
              color="primary"
              :label="$t('finish_signup')"
              type="submit"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import {ref, defineEmits, computed} from 'vue';
import {FIELDS} from 'src/data/FIELDS';
const account_fields = [FIELDS.EMAIL, FIELDS.USERNAME, FIELDS.PASSWORD_REPEAT]
const pages = [
  {
    key: 'account_data',
    label: 'Account',
    fields: account_fields,
  },
  {
    key: 'personal_data',
    label: 'Personal',
    fields: [],
  },
  {
    key: 'address_data',
    label: 'Address',
    fields: [],
  },
  {
    key: 'authentication',
    label: 'Authentication',
    fields: [],
  },
  {
    key: 'interests',
    label: 'Interests',
    fields: [],
  },
]

const step = ref(1)
const form_values = ref({})
const emit = defineEmits(['submit'])


const validFields = computed(() => {

  const res = Object.keys(form_values.value).every((key)=>{
    return FIELDS[key.toUpperCase()].attributes.rules.every((rule:()=>boolean)=>{
      console.log('field:', key, ', value:', rule(form_values.value[key]))
      // TODO handle for custom component
      return typeof rule(form_values.value[key]) === 'boolean'
    })
  })

  return res && form_values.value['email'] !== undefined
})


function updateValue(val: any, key: string){
    console.log('got new val', val)
    form_values.value[key] = val
}

/**
 * On submit, pass entered data outwards
**/
function onSubmit() {
  emit('submit', form_values)
}


</script>

<style scoped>

</style>
