<template>
  <GenericSelectField
    :initial-value="fieldValue.type"
    :options="jobTypeOptions"
    :rules="[]"
    :label="i18n.global.t('fields.job_type')"
    @change="(newValue) => fieldValueChange('type', newValue)"
  />

  <GenericSelectField
    :initial-value="fieldValue.status"
    :options="jobStatusOptions"
    :rules="[]"
    :label="i18n.global.t('fields.job_status')"
    @change="(newValue) => fieldValueChange('status', newValue)"
  />

  <div
    v-if="showWarning"
    class="text-negative q-mx-sm"
    style="text-align: left"
  >
    {{ i18n.global.t('messages.both_fields_needed') }}
  </div>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref, watch } from 'vue';

import { i18n } from 'src/boot/i18n';
import {
  JOB_STATUS,
  JOB_TYPE,
  translatedObjects,
  jobTypeStatuses,
} from 'src/data/ENUM';
import Job from 'src/flox/modules/form/data/types/Job';

import { FormStateKey, useFormStore } from '../../../stores/form';
import { fetchByKey } from '../../../helpers/form-helpers';

import GenericSelectField from './GenericSelectField.vue';

const props = defineProps<{
  stateKey: FormStateKey;
}>();

const emit = defineEmits<{
  (e: 'change', value: Job | null): void;
}>();

const store = useFormStore();

const jobTypeOptions = translatedObjects(JOB_TYPE, 'job_type');
const jobStatusOptions = ref(translatedObjects(JOB_STATUS, 'job_status'));

const initialValue = props.stateKey
  ? (fetchByKey(props.stateKey) as Job | undefined)
  : undefined;

const fieldValue: Ref<Job> = ref(initialValue || new Job());

const showWarning = ref(false);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (props.stateKey) {
    showWarning.value =
      !!(fieldValue.value.type || fieldValue.value.status) &&
      !(fieldValue.value.type && fieldValue.value.status);
    if (!!fieldValue.value && fieldValue.value.isComplete()) {
      store.setValue(props.stateKey, fieldValue.value);
    } else {
      store.setValue(props.stateKey, null);
    }
  } else if (fieldValue.value.isComplete()) {
    emit('change', fieldValue.value);
  } else {
    emit('change', null);
  }
}

/**
 * Update job status options when job type changes
 */
function updateJobStatusOptions(): void {
  const jobType = fieldValue.value.type as JOB_TYPE;
  const jobStatuses = jobTypeStatuses[jobType] || [];

  fieldValue.value.status = undefined;
  const jobStatusObject: Record<string, string> = {};
  jobStatuses.forEach((status) => {
    jobStatusObject[status] = status;
  });
  jobStatusOptions.value = translatedObjects(jobStatusObject, 'job_status');
}

/**
 * Watch fieldValue.value.jobType and update job status options
 */
watch(
  () => fieldValue.value.type,
  () => {
    updateJobStatusOptions();
  }
);

/**
 * Save value on change
 */
watch(
  fieldValue,
  () => {
    saveValue();
  },
  { deep: true }
);

/**
 * Updates the field value if a subfield updates.
 * @param fieldKey - name of the field to update
 * @param value - new value
 * @returns void
 */
function fieldValueChange(
  fieldKey: 'type' | 'status',
  value: JOB_TYPE | JOB_STATUS
): void {
  if (fieldKey === 'type') {
    fieldValue.value = new Job(value as JOB_TYPE, fieldValue.value.status);
  } else if (fieldKey === 'status') {
    fieldValue.value = new Job(fieldValue.value.type, value as JOB_STATUS);
  } else {
    throw new Error('Unknown field key');
  }
}
</script>
