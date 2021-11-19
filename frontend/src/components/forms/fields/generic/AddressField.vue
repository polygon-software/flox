<template>
  <!-- Top Row: Street & house number -->
  <div class="flex justify-between">
    <q-input
      dense
      :label="$t('street')"
      v-model="street"
      type="text"
      lazy-rules="ondemand"
      :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_address')]"
      style="width:65%"
      @change="emitValue"
    />
    <q-input
      dense
      :label="$t('number')"
      v-model="number"
      type="text"
      lazy-rules="ondemand"
      :rules="[(val) => IS_VALID_HOUSE_NUMBER(val) || $t('invalid_house_number')]"
      style="width:30%"
      @change="emitValue"
    />
  </div>
  <!-- Bottom Row: City & ZIP code -->
  <div class="flex justify-between">
    <q-input
      dense
      :label="$t('city')"
      v-model="city"
      type="text"
      :rules="[(val) => IS_VALID_STRING(val) || $t('invalid_city')]"
      style="width:65%"
      @change="emitValue"
    >
    </q-input>
    <q-input
      dense
      :label="$t('zip_code')"
      v-model="zip_code"
      type="number"
      :rules="[(val) => IS_VALID_ZIP(val) || $t('invalid_zip_code')]"
      style="width:30%"
      mask="######"
      @change="emitValue"
    >
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IS_VALID_STRING, IS_VALID_HOUSE_NUMBER, IS_VALID_ZIP } from 'src/data/RULES';
const emit = defineEmits(['change'])

const street = ref('')
const number = ref(null)
const zip_code = ref(null)
const city = ref(null)

/**
 * Emits the updated value
 */
function emitValue(){
  emit('change', {
    street: street.value,
    number: number.value,
    zip_code: zip_code.value,
    city: city.value,
    // TODO: possibly add Country, get format from some class
  })
}
</script>

<style scoped>

</style>
