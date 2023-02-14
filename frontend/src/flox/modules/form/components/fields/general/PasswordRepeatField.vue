<template>
  <FloxWrapper :module="MODULES.AUTH">
    <LabelWrapper
      :label="
        newPassword
          ? $t('authentication.new_password')
          : $t('authentication.password')
      "
    >
      <q-tooltip :offset="[0, -115]">
        {{ $t('authentication.password_rule') }}
      </q-tooltip>
      <q-input
        v-model="fieldValue.password"
        dense
        outlined
        :type="showPassword ? 'text' : 'password'"
        :rules="[IS_VALID_PASSWORD]"
      >
        <template #append>
          <q-icon
            :name="showPassword ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>
    </LabelWrapper>
    <LabelWrapper
      :label="
        newPassword
          ? $t('authentication.new_password_repeat')
          : $t('authentication.password_repeat')
      "
    >
      <q-input
        v-model="fieldValue.passwordRepeat"
        dense
        outlined
        :type="showRepeatedPassword ? 'text' : 'password'"
        :rules="[
          (val) =>
            val === fieldValue.password || $t('errors.non_matching_password'),
        ]"
      >
        <template #append>
          <q-icon
            :name="showRepeatedPassword ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="showRepeatedPassword = !showRepeatedPassword"
          />
        </template>
      </q-input>
    </LabelWrapper>
  </FloxWrapper>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, Ref } from 'vue';

import { MODULES } from '../../../../../enum/MODULES';
import { fetchByKey } from '../../../helpers/form-helpers';
import { FormStateKey, useFormStore } from '../../../stores/form';
import { IS_VALID_PASSWORD } from '../../../data/RULES';
import PasswordRepeat from '../../../data/types/PasswordRepeat';
import FloxWrapper from '../../../../../core/components/FloxWrapper.vue';

import LabelWrapper from './wrappers/LabelWrapper.vue';

/**
 * This component contains field to enter a new password, as well as another field to repeat the new password. Both entries need to match.
 */

const props = withDefaults(
  defineProps<{
    // Used to fetch or store data from/to the store
    stateKey: FormStateKey;
    // Changes the fields label (e.g. "Repeat Password" or "Repeat new Password")
    newPassword?: boolean;
  }>(),
  {
    newPassword: false,
  }
);

const store = useFormStore();
const initialValue: PasswordRepeat | null = fetchByKey(
  props.stateKey
) as PasswordRepeat | null;
const fieldValue: Ref<PasswordRepeat> = ref(
  initialValue ?? new PasswordRepeat()
);

const showPassword = ref(false);
const showRepeatedPassword = ref(false);

/**
 * Save the updated value if valid, otherwise null
 * @returns void
 */
function saveValue(): void {
  if (fieldValue.value.isComplete()) {
    store.setValue(props.stateKey, fieldValue.value.password);
  } else {
    store.setValue(props.stateKey, null);
  }
}

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
</script>
