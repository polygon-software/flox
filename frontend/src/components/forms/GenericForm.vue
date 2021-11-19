<template>
  <q-form
    class="q-gutter-md"
    ref="form_ref"
    greedy
  >
    <q-stepper
      v-model="_form.step.value"
      ref="stepper"
      animated
      active-color="primary"
      done-icon="done"
    >
      <q-step
        v-for="(page, index) in _form.pages.value"
        :key="page.key"
        :name="index+1"
        :prefix="index+1"
        :title="page.label"
        :done="_form.step.value > index"
      >
        <component
          v-for="field in page.fields"
          :key="field.key"
          :is="field.component"
          v-bind="field.attributes"
          v-model="_form.values.value[field.key]"
          @change="(newValue) => _form.updateValue(field.key, newValue)"
          @update:model-value="(newValue) => _form.updateValue(field.key, newValue)"
        />
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            v-if="_form.step.value > 1"
            @click="$refs.stepper.previous()"
            flat
            style="margin-right: 30px"
            color="primary"
            :label="$t('back')"
            class="q-ml-sm" />
          <q-btn
            v-if="_form.step.value < _form.pages.value.length"
            @click="$refs.stepper.next()"
            color="primary"
            :label="$t('next_step')"
            :disable="!_form.pageValid.value"
          />
          <q-btn
            v-if="_form.step.value === _form.pages.value.length"
            color="primary"
            :label="finish_label ?? $t('finish')"
            @click="() => {form_ref.validate(); onSubmit()}"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-form>
</template>

<script setup lang="ts">
import {defineProps, ref} from 'vue';
import {Form} from 'src/helpers/form-helpers';
import _ from 'lodash';

const form_ref = ref(null)

const props = defineProps({
  finish_label: String,
  form: Form,
  finish: Function,
})

// Get copy of prop form
const _form: Form|undefined = _.cloneDeep(props.form);



/**
 *
 */
function onSubmit(){
  // Execute passed function
  if(props.finish){
    props.finish()
  }
}


</script>

<style scoped>

</style>
