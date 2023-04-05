<template>
  <FloxWrapper :module="MODULES.AUTH">
    <LabelWrapper :label="$t('authentication.password')">
      <q-input
        v-model="password"
        :rules="[IS_VALID_PASSWORD]"
        :type="isPwd ? 'password' : 'text'"
        dense
        outlined
        @change="saveValue"
      >
        <template #append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
    </LabelWrapper>
  </FloxWrapper>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import FloxWrapper from 'src/flox/core/components/FloxWrapper.vue';
import { MODULES } from 'src/flox/enum/MODULES';

import { IS_VALID_PASSWORD } from '../../../data/RULES';
import { FormStateKey, useFormStore } from '../../../stores/form';

import LabelWrapper from './wrappers/LabelWrapper.vue';

const props = withDefaults(
  defineProps<{
    stateKey?: FormStateKey | null;
  }>(),
  {
    stateKey: null,
  }
);

const emit = defineEmits<{
  (e: 'change', value: string | null): void;
}>();

const store = useFormStore();

/**
 * This component contains field to enter a password.
 */

const password = ref('');
const isPwd = ref(true);

/**
 * Saves the updated value
 * @param value - the updated value
 * @returns void
 */
function saveValue(value: string): void {
  if (props.stateKey) {
    store.setValue(props.stateKey, value);
  } else {
    emit('change', value);
  }
}
</script>
