<template>
  <LabelWrapper :label="label">
    <q-input
      v-model="fieldValue"
      name="freeText"
      dense
      outlined
      type="textarea"
      @change="saveValue"
    />
  </LabelWrapper>
</template>

<script setup lang="ts">
import { PropType, ref, Ref } from 'vue';
import { FormStateKey, useFormStore } from 'stores/form';
import { fetchByKey } from 'src/helpers/form/form-helpers';

import { i18n } from 'boot/i18n';
import LabelWrapper from 'src/flox/modules/form/components/fields/general/wrappers/LabelWrapper.vue';

const props = defineProps({
  stateKey: {
    type: Object as PropType<FormStateKey>,
    required: false, // If not given, this field emits instead of saving
    default: null,
  },
  initialValue: {
    type: String,
    required: false,
    default: null,
  },
  label: {
    type: String,
    required: false,
    default: i18n.global.t('authentication.free_text'),
  },
});

const emit = defineEmits(['change']);

const store = useFormStore();
const initialValue = fetchByKey(props.stateKey);
const fieldValue: Ref<string | null> = ref((initialValue as string) ?? null);

/**
 * Save the updated value
 * @returns {void}
 */
function saveValue() {
  if (props.stateKey) {
    if (fieldValue.value) {
      store.setValue(props.stateKey, fieldValue.value);
    } else {
      store.setValue(props.stateKey, null);
    }
  } else {
    emit('change', fieldValue.value);
  }
}
</script>
