<template>
  <QForm
    v-if="form"
    ref="formRef"
    :class="`text-${textPosition}`"
    @reset="onCancel"
    @submit="onSubmit"
  >
    <!-- Stepper (for multi-page forms) -->
    <QStepper
      v-if="form.pages.length > 1"
      ref="stepper"
      v-model="form.step"
      active-color="primary"
      animated
      done-icon="done"
    >
      <q-step
        v-for="(page, index) in form.pages"
        :key="page.key"
        :done="form.step.value > index"
        :name="index + 1"
        :prefix="index + 1"
        :title="page.label"
      >
        <FormCard
          v-for="card in page.cards"
          :key="card.key"
          :card="card"
          class="q-mb-md"
        >
          <div
            v-for="(fieldRow, fieldRowIndex) in card.fieldRows"
            :key="`fieldGroup_${fieldRowIndex}`"
            :class="
              Array.isArray(fieldRow) && fieldRow.length > 1 ? 'row' : 'column'
            "
          >
            <component
              :is="field.component"
              v-for="field in Array.isArray(fieldRow) ? fieldRow : [fieldRow]"
              :key="field.key"
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
            :flat="flat"
            :label="$t('buttons.back')"
            class="q-ml-sm"
            color="primary"
            style="margin-right: 30px"
            @click="toPrevious"
          />
          <q-btn
            v-if="form.step.value < form.pages.length"
            :disable="!form.pageValid"
            :label="$t('buttons.next')"
            color="primary"
            @click="toNext"
          />
          <q-btn
            v-if="form.step.value === form.pages.length"
            :disable="!form.pageValid"
            :label="finishLabel"
            color="primary"
            @click="onSubmit"
          />
        </q-stepper-navigation>
      </template>
    </QStepper>
    <div v-if="form.pages.length <= 1 && form.pages[0].cards.length > 1">
      <!-- Multi card (for single-page forms) -->
      <FormCard
        v-for="card in form.pages[0].cards"
        :key="card.key"
        :card="card"
        class="q-mb-md"
      >
        <div
          v-for="(fieldRow, fieldRowIndex) in card.fieldRows"
          :key="`fieldGroup_${fieldRowIndex}`"
          :class="
            Array.isArray(fieldRow) && fieldRow.length > 1 ? 'row' : 'column'
          "
        >
          <component
            :is="field.component"
            v-for="field in Array.isArray(fieldRow) ? fieldRow : [fieldRow]"
            :key="field.key"
            v-bind="{
              store,
              stateKey: {
                formKey,
                pageKey: form.pages[0].key,
                cardKey: card.key,
                fieldKey: field.key,
              },
              ...field.attributes,
              options: optionOverrides?.[field.key] ?? field.attributes.options,
            }"
          />
        </div>
      </FormCard>
    </div>
    <!-- Single card (for single-page forms) -->
    <div
      v-for="(fieldRow, fieldRowIndex) in form.pages[0].cards[0].fieldRows"
      v-else
      :key="`fieldGroup_${fieldRowIndex}`"
      :class="Array.isArray(fieldRow) && fieldRow.length > 1 ? 'row' : 'column'"
    >
      <component
        :is="field.component"
        v-for="field in Array.isArray(fieldRow) ? fieldRow : [fieldRow]"
        :key="field.key"
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
    </div>
    <!--- Buttons --->
    <div class="showCancel ? row justify-between : row justify-around">
      <!-- Cancel button -->
      <q-btn
        v-if="showCancel"
        :class="`${ALTERNATE_BUTTON_CLASS} q-mt-lg`"
        :disable="loading"
        :label="!loading ? cancelLabel : loadingLabel"
        :style="`${DEFAULT_BUTTON_STYLE}`"
        type="reset"
      >
        <q-inner-loading :showing="loading" />
      </q-btn>

      <!-- Finish button -->
      <q-btn
        v-if="showFinish"
        :class="`${ALTERNATE_BUTTON_CLASS} q-mt-lg`"
        :disable="loading || !form.pageValid"
        :label="!loading ? finishLabel : loadingLabel"
        :style="`${DEFAULT_BUTTON_STYLE}`"
        color="primary"
        type="submit"
      >
        <q-inner-loading :showing="loading" />
      </q-btn>
    </div>
  </QForm>
</template>

<script lang="ts" setup>
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
    showFinish?: boolean;
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
    showFinish: true,
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
