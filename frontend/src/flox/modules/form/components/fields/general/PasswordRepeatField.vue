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
        :type="isPwd ? 'password' : 'text'"
        :rules="[
          (val) => IS_VALID_PASSWORD(val) || $t('errors.invalid_password'),
        ]"
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
        :type="isPwdRepeat ? 'password' : 'text'"
        :rules="[
          (val) =>
            val === fieldValue.password || $t('errors.non_matching_password'),
        ]"
      >
        <template #append>
          <q-icon
            :name="isPwdRepeat ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwdRepeat = !isPwdRepeat"
          />
        </template>
      </q-input>
    </LabelWrapper>
  </FloxWrapper>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, Ref } from 'vue';

import { MODULES } from '../../../../../MODULES';
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
    stateKey: FormStateKey;
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

const isPwd = ref(true);
const isPwdRepeat = ref(true);

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
