<template>
  <QForm v-if="form" ref="formRef" :class="`q-gutter-md text-${textPosition}`">
    <!-- Stepper (for multi-page forms) -->
    <QStepper
      v-if="form.pages.length > 1"
      ref="stepper"
      v-model="form.step"
      active-color="primary"
      done-icon="done"
      animated
    >
      <q-step
        v-for="(page, index) in form.pages"
        :key="page.key"
        :name="index + 1"
        :prefix="index + 1"
        :title="page.label"
        :done="form.step.value > index"
      >
        <FormCard
          v-for="card in page.cards"
          :key="card.key"
          :card="card"
          class="q-mb-lg"
        >
          <div
            v-for="(field, fieldIndex) in card.fields"
            :key="`field_${fieldIndex}`"
          >
            <component
              :is="field.component"
              v-if="field"
              v-bind="{
                store,
                stateKey: {
                  formKey,
                  pageKey: page.key,
                  cardKey: card.key,
                  fieldKey: field.key,
                },
                ...field.attributes,
                options:
                  optionOverrides?.[field.key] ?? field.attributes.options,
              }"
            />
          </div>
        </FormCard>
      </q-step>
      <template #navigation>
        <q-stepper-navigation>
          <q-btn
            v-if="form.step.value > 1"
            color="primary"
            :label="$t('buttons.back')"
            :flat="flat"
            style="margin-right: 30px"
            class="q-ml-sm"
            @click="toPrevious"
          />
          <q-btn
            v-if="form.step.value < form.pages.length"
            color="primary"
            :label="$t('buttons.next')"
            :disable="!form.pageValid"
            @click="toNext"
          />
          <q-btn
            v-if="form.step.value === form.pages.length"
            color="primary"
            :label="finishLabel"
            :disable="!form.pageValid"
            @click="onSubmit"
          />
        </q-stepper-navigation>
      </template>
    </QStepper>
    <!-- Single card (for single-page forms) -->
    <div v-else class="q-mb-lg">
      <component
        :is="field.component"
        v-for="field in form.pages[0].cards[0].fields"
        :key="field.key"
        class="q-mb-md"
        v-bind="{
          store,
          stateKey: {
            formKey,
            pageKey: form.pages[0].key,
            cardKey: form.pages[0].cards[0].key,
            fieldKey: field.key,
          },
          ...field.attributes,
          options: optionOverrides?.[field.key] ?? field.attributes.options,
        }"
      />
      <!--- Buttons --->
      <div class="showCancel ? row justify-between : row justify-around">
        <!-- Cancel button -->
        <q-btn
          v-if="showCancel"
          :label="!loading ? cancelLabel : loadingLabel"
          :class="`${ALTERNATE_BUTTON_CLASS} q-mt-md`"
          :style="`${DEFAULT_BUTTON_STYLE}`"
          :disable="loading"
          @click="onCancel"
        >
          <q-inner-loading :showing="loading" />
        </q-btn>

        <!-- Finish button -->
        <q-btn
          color="primary"
          :label="!loading ? finishLabel : loadingLabel"
          :class="`${ALTERNATE_BUTTON_CLASS} q-mt-md`"
          :style="`${DEFAULT_BUTTON_STYLE}`"
          :disable="loading"
          @click="onSubmit"
        >
          <q-inner-loading :showing="loading" />
        </q-btn>
      </div>
    </div>
  </QForm>
</template>

<script setup lang="ts">
/**
 * This component defines a generic form that can have a single or multiple pages.
 */
import { onBeforeMount, Ref, ref } from 'vue';
import { QForm, QStepper } from 'quasar';

import {
  ALTERNATE_BUTTON_CLASS,
  DEFAULT_BUTTON_STYLE,
} from 'src/css/defaultStyles';
import { i18n } from 'boot/i18n';

import { useFormStore } from '../stores/form';
import { buildStoreSubstructure } from '../helpers/form-helpers';
import FormPage from '../data/types/FormPage';
import FormStructure from '../data/types/FormStructure';

import FormCard from './cards/FormCard.vue';

const props = withDefaults(
  defineProps<{
    // Key used to retrieve the forms data from the store
    formKey: string;
    // the label to show on the 'finish' button
    finishLabel?: string;
    // loading status to show on the finish button
    loading?: boolean;
    // the label to show when loading
    loadingLabel?: string;
    // Alignment of the text in the form
    textPosition?: string;
    // The pages to show, each containing fields, label and key
    pages: FormPage[];
    // Whether the form should be a flat Q-Card (no borders) or not
    flat?: boolean;
    // Whether the store state should be preserved when rebuilding the form
    preserveState?: boolean;
    // Manual override for field options (e.g. in GenericSelectFields): maps a field key to a list of options
    optionOverrides?: Record<string, unknown[]> | null;
    showCancel?: boolean;
    cancelLabel?: string;
  }>(),
  {
    finishLabel: i18n.global.t('buttons.finish'),
    loadingLabel: `${i18n.global.t('general.loading')}...`,
    textPosition: 'right',
    loading: false,
    flat: false,
    preserveState: false,
    optionOverrides: null,
    showCancel: false,
    cancelLabel: i18n.global.t('buttons.cancel'),
  }
);

// Create Form instance with pages from props
const emit = defineEmits<{
  (e: 'submit', value: QForm | null): void;
  (e: 'cancel', value: null): void;
}>();
const formRef: Ref<QForm | null> = ref(null);
const form: Ref<FormStructure | null> = ref(null);
const stepper: Ref<QStepper | null> = ref(null);

const store = useFormStore();

onBeforeMount(() => {
  // Initialize form structure
  form.value = new FormStructure(props.formKey, props.pages);

  // Set up store structure
  buildStoreSubstructure(props.formKey, props.pages, props.preserveState);
});

/**
 * Validates and, if valid, submits the form with all entered values
 * @returns {Promise<void>} - done
 */
async function onSubmit(): Promise<void> {
  const isValid = await formRef.value?.validate();
  if (isValid) {
    emit('submit', formRef.value);
  }
}

/**
 * Emits the click of the cancel button
 * @returns void
 */
function onCancel(): void {
  emit('cancel', null);
}

/**
 * Goes to the next page and animated scrolling to the top of the page
 * @returns void
 */
function toNext(): void {
  stepper.value?.next();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Calls previous on QStepper to avoid typing issues.
 * @returns void
 */
function toPrevious(): void {
  stepper.value?.previous();
}
</script>
