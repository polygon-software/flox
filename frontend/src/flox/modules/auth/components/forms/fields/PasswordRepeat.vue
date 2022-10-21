<template>
  <FloxWrapper :module="MODULES.AUTH">
    <q-input
      v-model="password"
      dense
      :label="$t('authentication.password')"
      lazy-rules="ondemand"
      :type="isPwd ? 'password' : 'text'"
      :rules="passwordRules"
    >
      <template #append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-input
      v-model="passwordRepeat"
      dense
      :label="$t('authentication.password_repeat')"
      lazy-rules="ondemand"
      :type="isPwdRepeat ? 'password' : 'text'"
      :rules="matchingRules"
    >
      <template #append>
        <q-icon
          :name="isPwdRepeat ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwdRepeat = !isPwdRepeat"
        />
      </template>
    </q-input>
  </FloxWrapper>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from 'vue';
import FloxWrapper from 'src/flox/core/components/FloxWrapper.vue';
import {MODULES} from 'src/flox/MODULES';
import {joiPasswordSchema, joiSchemaToValidationRule} from 'src/tools/validation.tool';
import {i18n} from 'boot/i18n';

/**
 * This component contains field to enter a new password, as well as another field to repeat the new password. Both entries need to match.
 */

const props = defineProps({
  modelValue: {
    required: true,
    type: String
  },
});

let password = ref(props.modelValue ?? '')
let passwordRepeat = ref(props.modelValue ?? '')
const isPwd = ref(true)
const isPwdRepeat = ref(true)

const passwordRules = [joiSchemaToValidationRule(joiPasswordSchema(), i18n.global.t('errors.invalid_password'))]
const matchingRules = [(val: string) => val === password.value || i18n.global.t('errors.non_matching_password')]


const emit = defineEmits(['change'])

watch(password, (newVal) => {
  emitUpdate(newVal)
})

watch(passwordRepeat, (newVal) => {
  emitUpdate(newVal)
})

/**
 * Emits an update with new value
 * @param {string} value - the password
 * @returns {void}
 */
function emitUpdate(value: string){
  if(password.value.length > 0 && password.value === passwordRepeat.value){
    emit('change', value)
  } else {
    // Empty emit (input not valid)
    emit('change', '')
  }
}

</script>
