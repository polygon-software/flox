<template>
  <GenericSelectField
    :initial-value="fieldValue.jobType"
    :options="jobTypeOptions"
    :rules="[]"
    :label="i18n.global.t('fields.job_type')"
    @change="(newValue) => fieldValueChange('jobType', newValue)"
  />

  <GenericSelectField
    :initial-value="fieldValue.jobStatus"
    :options="jobStatusOptions"
    :rules="[]"
    :label="i18n.global.t('fields.job_status')"
    @change="(newValue) => fieldValueChange('jobStatus', newValue)"
  />
</template>

<script setup lang="ts">
import { defineProps, Ref, ref, watch } from 'vue';

import { i18n } from 'boot/i18n';
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
  ? (fetchByKey(props.stateKey) as Job | null)
  : null;

const fieldValue: Ref<Job> = ref(
  initialValue && initialValue.isComplete() ? initialValue : new Job()
);

/**
 * Save or emit the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (props.stateKey) {
    if (fieldValue.value.isComplete()) {
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
  const jobType = fieldValue.value.jobType as JOB_TYPE;
  const jobStatuses = jobTypeStatuses[jobType] || [];

  fieldValue.value.jobStatus = undefined;
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
  () => fieldValue.value.jobType,
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
  fieldKey: 'jobType' | 'jobStatus',
  value: JOB_TYPE | JOB_STATUS
): void {
  if (fieldKey === 'jobType') {
    fieldValue.value.jobType = value as JOB_TYPE;
  } else if (fieldKey === 'jobStatus') {
    fieldValue.value.jobStatus = value as JOB_STATUS;
  } else {
    throw new Error('Unknown field key');
  }
}
</script>
