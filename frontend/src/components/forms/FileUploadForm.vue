<template>
  <q-form
    ref="form_ref"
    greedy
    class="q-gutter-md"
  >
    <q-card
      class="q-pa-md"
    >
      <div class="row flex flex-center">
        <b class="text-primary">
          {{ form.pages.value[0].label }}
        </b>
      </div>
      <q-separator class="q-ma-lg"/>
      <component
        v-for="field in form.pages.value[0].fields"
        :key="field.key"
        :is="field.component"
        v-bind="field.attributes"
        v-model="form.values.value[field.key]"
        @change="(newValue) => form.updateValue(field.key, newValue)"
        @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
      />
      <q-btn
        color="primary"
        :label="finish_label ?? $t('finish')"
        @click="onSubmit"
      />
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
/**
 * This component defines a generic form that can have a single or multiple pages.
 * It takes the following properties:
 * @param {Object[]} pages - the pages to show, each containing fields, label and key
 * @param {finish} function - the function to call once the form is completed
 * @param {string} [finish_label] - the label to show on the 'finish' button (will default to 'Finish' in correct language)
 */
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
