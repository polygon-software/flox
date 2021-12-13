<template>
  <q-input
      v-model="password"
      dense
      outlined
      :label="$t('account_data.password')"
      lazy-rules="ondemand"
      :type="isPwd ? 'password' : 'text'"
      :rules="[(val) => IS_VALID_PASSWORD(val) || $t('error.invalid_password')]"
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
      outlined
      :label="$t('account_data.repeat_password')"
      lazy-rules="ondemand"
      :type="isPwdRepeat ? 'password' : 'text'"
      :rules="[val => val === password || $t('error.non_matching_password')]"
  >
    <template #append>
      <q-icon
          :name="isPwdRepeat ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwdRepeat = !isPwdRepeat"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from 'vue';
import {IS_VALID_PASSWORD} from 'src/data/RULES';

/**
 * This component contains field to enter a new password, as well as another field to repeat the new password. Both entries need to match.
 */

const props = defineProps({
  modelValue: {
    required: false,
    type: String,
    default: '',
  },
  rules: {
    required: false,
    type: Array,
  }
});

let password = ref(props.modelValue ?? '')
let passwordRepeat = ref(props.modelValue ?? '')
const isPwd = ref(true)
const isPwdRepeat = ref(true)

const emit = defineEmits(['change'])

watch(password, (newVal) => {
  emitUpdate(newVal)
})

watch(passwordRepeat, (newVal) => {
  emitUpdate(newVal)
})

/**
 * Emits an update with the new input value
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
