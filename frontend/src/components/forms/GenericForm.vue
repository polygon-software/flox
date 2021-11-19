<template>
  <q-form
    class="q-gutter-md"
    ref="form_ref"
    greedy
  >
    <q-stepper
      v-model="form.step.value"
      ref="stepper"
      animated
      active-color="primary"
      done-icon="done"
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
            @click="$refs.stepper.previous()"
            flat
            style="margin-right: 30px"
            color="primary"
            :label="$t('back')"
            class="q-ml-sm" />
          <q-btn
            v-if="form.step.value < form.pages.value.length"
            @click="$refs.stepper.next()"
            color="primary"
            :label="$t('next_step')"
            :disable="!form.pageValid.value"
          />
          <q-btn
            v-if="form.step.value === form.pages.value.length"
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
const emit = defineEmits(['submit'])

const form_ref = ref(null)

const props = defineProps({
  finish_label: String,
  pages: Array,
  finish: Function,
})

// Get copy of prop form
const _pages = props.pages ? props.pages as Record<string, unknown>[] : undefined
const form: Form = new Form(_pages)

/**
 * TODO
 */
function onSubmit(){
  emit('submit', form.values.value)
}


</script>

<style scoped>

</style>
