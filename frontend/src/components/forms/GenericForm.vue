<template>
  <q-form
    ref="form_ref"
    greedy
    class="q-gutter-md"
  >
    <q-stepper
      v-model="form.step.value"
      ref="stepper"
      active-color="primary"
      done-icon="done"
      animated
    >
      <q-step
        v-for="(page, index) in form.pages.value"
        :key="page.key"
        :name="index+1"
        :prefix="index+1"
        :title="page.label"
        :done="form.step.value > index"
      >
        <component
          v-for="field in page.fields"
          :key="field.key"
          :is="field.component"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          @change="(newValue) => form.updateValue(field.key, newValue)"
          @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
        />
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            v-if="form.step.value > 1"
            color="primary"
            :label="$t('back')"
            flat
            style="margin-right: 30px"
            class="q-ml-sm"
            @click="$refs.stepper.previous()"
          />
          <q-btn
            v-if="form.step.value < form.pages.value.length"
            color="primary"
            :label="$t('next_step')"
            :disable="!form.pageValid.value"
            @click="$refs.stepper.next()"
          />
          <q-btn
            v-if="form.step.value === form.pages.value.length"
            color="primary"
            :label="finish_label ?? $t('finish')"
            @click="onSubmit"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-form>
</template>

<script setup lang="ts">
import {defineProps, Ref, ref} from 'vue';
import {Form} from 'src/helpers/form-helpers';
import {QForm} from 'quasar';
const emit = defineEmits(['submit'])

const form_ref: Ref<QForm|null> = ref(null)

const props = defineProps({
  finish_label: String,
  pages: Array,
  finish: Function,
})

// Get copy of prop form
const _pages = props.pages ? props.pages as Record<string, unknown>[] : undefined
const form: Form = new Form(_pages)

/**
 * Validates and, if valid, submits the form with all entered values
 * @async
 */
async function onSubmit(){
  const is_valid = await form_ref.value?.validate()

  if(is_valid){
    emit('submit', form.values.value)
  }

}


</script>
