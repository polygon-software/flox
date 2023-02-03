<template>
  <QForm ref="formRef" greedy class="q-gutter-md">
    <!-- Stepper (for multi-page forms) -->
    <QStepper
      v-if="form.pages.value.length > 1"
      ref="stepperRef"
      v-model="form.step.value"
      active-color="primary"
      done-icon="done"
      animated
    >
      <q-step
        v-for="(page, index) in form.pages.value"
        :key="page.key"
        :name="index + 1"
        :prefix="index + 1"
        :title="page.label"
        :done="form.step.value > index"
      >
        <component
          :is="field.component"
          v-for="field in page.fields"
          :key="field.key"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          :initial-value="form.values.value[field.key]"
          @change="form.updateValue(field.key, $event)"
          @update:model-value="form.updateValue(field.key, $event)"
        />
      </q-step>
      <template #navigation>
        <q-stepper-navigation>
          <q-btn
            v-if="form.step.value > 1"
            color="primary"
            :label="$t('general.back')"
            flat
            style="margin-right: 30px"
            class="q-ml-sm"
            @click="stepperRef?.previous()"
          />
          <q-btn
            v-if="form.step.value < form.pages.value.length"
            color="primary"
            :label="$t('general.next')"
            :disable="!form.pageValid.value"
            @click="stepperRef?.next()"
          />
          <q-btn
            v-if="form.step.value === form.pages.value.length"
            color="primary"
            :label="finishLabel"
            @click="onSubmit"
          />
        </q-stepper-navigation>
      </template>
    </QStepper>
    <!-- Single card (for single-page forms -->
    <q-card v-else class="q-pa-md">
      <q-card-section>
        <div class="row flex flex-center">
          <h5 class="q-ma-none">
            {{ form.pages.value[0].label }}
          </h5>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <component
          :is="field.component"
          v-for="field in form.pages.value[0].fields"
          :key="field.key"
          v-bind="field.attributes"
          v-model="form.values.value[field.key]"
          :initial-value="form.values.value[field.key]"
          @change="form.updateValue(field.key, $event)"
          @update:model-value="form.updateValue(field.key, $event)"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          color="primary"
          :label="!loading ? finishLabel : loadingLabel"
          :disable="loading"
          @click="onSubmit"
        >
          <q-inner-loading :showing="loading" />
        </q-btn>
      </q-card-actions>
    </q-card>
  </QForm>
</template>

<script setup lang="ts">
/**
 * This component defines a generic form that can have a single or multiple pages.
 * It takes the following properties:
 *
 * @param pages - the pages to show, each containing fields, label and key
 * @param finishLabel - the label to show on the 'finish' button
 * @param loadingLabel - the label to show when loading
 * @param loading - loading status to show on the finish button
 */
import { QForm, QStepper } from 'quasar';
import { Ref, ref } from 'vue';

import { i18n } from 'boot/i18n';
import { FormPage, MultiPageForm } from 'components/forms/MultiPageForm';

const props = withDefaults(
  defineProps<{
    pages: FormPage[];
    finishLabel?: string;
    loadingLabel?: string;
    loading?: boolean;
  }>(),
  {
    finishLabel: i18n.global.t('general.finish'),
    loadingLabel: `${i18n.global.t('general.loading')}...`,
    loading: false,
  }
);
const emit = defineEmits<{
  (e: 'submit', form: Record<string, any>): void;
}>();
const formRef: Ref<QForm | null> = ref(null);
const stepperRef: Ref<QStepper | null> = ref(null);

// Create Form instance with pages from props
const form: MultiPageForm = new MultiPageForm(props.pages);

/**
 * Validates and, if valid, submits the form with all entered values
 */
async function onSubmit(): Promise<void> {
  const isValid = await formRef.value?.validate();
  if (isValid) {
    emit('submit', form.values.value);
  }
}
</script>
