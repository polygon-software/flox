<template>
  <q-form
    ref="form_ref"
    greedy
    class="q-gutter-md"
  >
    <!-- Stepper (for multi-page forms) -->
    <q-stepper
      v-if="form.pages.value.length > 1"
      ref="stepper"
      v-model="form.step.value"
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
          :is="field.component"
          v-for="field in page.fields"
          :key="field.key"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          @change="(newValue) => form.updateValue(field.key, newValue)"
          @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
        />
      </q-step>
      <template #navigation>
        <q-stepper-navigation>
          <q-btn
            v-if="form.step.value > 1"
            color="primary"
            :label="$t('buttons.back')"
            flat
            style="margin-right: 30px"
            class="q-ml-sm"
            @click="$refs.stepper.previous()"
          />
          <q-btn
            v-if="form.step.value < form.pages.value.length"
            color="primary"
            :label="$t('buttons.next_step')"
            :disable="!form.pageValid.value"
            @click="$refs.stepper.next()"
          />
          <q-btn
            v-if="form.step.value === form.pages.value.length"
            color="primary"
            :label="finishLabel"
            @click="onSubmit"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <!-- Single card (for single-page forms -->
    <q-card
      v-else
      class="q-pa-md"
    >
      <q-card-section>
        <div class="row flex flex-center">
          <b class="text-primary">
            {{ form.pages.value[0].label }}
          </b>
        </div>
      </q-card-section>
      <q-separator class="q-ma-lg"/>
      <q-card-section>
        <component
          :is="field.component"
          v-for="field in form.pages.value[0].fields"
          :key="field.key"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          @change="(newValue) => form.updateValue(field.key, newValue)"
          @update:model-value="(newValue) => form.updateValue(field.key, newValue)"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          color="primary"
          :label="finishLabel"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
/**
 * This component defines a generic form that can have a single or multiple pages.
 * It takes the following properties:
 * @param {Object[]} pages - the pages to show, each containing fields, label and key
 * @param {string} [finishLabel] - the label to show on the 'finish' button (will default to 'Finish' in correct language)
 */
import {defineProps, Ref, ref} from 'vue';
import {i18n} from 'boot/i18n';
import {Form} from 'src/helpers/form-helpers';
import {QForm} from 'quasar';
const emit = defineEmits(['submit'])

const form_ref: Ref<QForm|null> = ref(null)

const props = defineProps({
  finishLabel: {
    required: false,
    type: String,
    default: i18n.global.t('buttons.finish'),
  },
  pages: {
    required: true,
    type: Array,
    default: () => [],
  },
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
