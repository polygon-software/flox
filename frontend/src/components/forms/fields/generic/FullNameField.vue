<template>
  <div>
    <q-input
      v-model="firstName"
      :label="$t('account_data.first_name')"
      type="text"
      :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_name')]"
      @change="emitValue"
    >
    </q-input>
    <q-input
      v-model="lastName"
      :label="$t('account_data.last_name')"
      type="text"
      :rules="[(val) => IS_VALID_STRING(val) || $t('errors.invalid_name')]"
      @change="emitValue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IS_VALID_STRING } from 'src/data/RULES';
const emit = defineEmits(['change'])

const props = defineProps({
  initialValue: {
    type: Object,
    required: false,
    default: () => { return { firstName: null, lastName: null} }
  }
})

const firstName = ref(props.initialValue.firstName as string|null)
const lastName = ref(props.initialValue.lastName as string|null)


/**
 * Emits the inputs
 * @returns {void}
 */
function emitValue(){
  emit('change', {
    firstName: firstName.value,
    lastName: lastName.value
  })
}

</script>
