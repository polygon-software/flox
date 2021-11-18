<template>
  <div class="flex justify-between items-center">
    <strong>{{ $t('correspondence_address') }}</strong>
    <q-checkbox
      v-model="show_correspondence"
      :label="$t('edit_correspondence_address')"
      val="xs"
    />
  </div>

  <div v-if="!show_correspondence">
    <div class="flex justify-between">
      <q-input
        dense
        :label="$t('street')"
        v-model="address"
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
        mask="###"
        @change="emitValue"
      />
    </div>
    <div class="flex justify-between">
      <q-input
        dense
        :label="$t('city')"
        v-model="city"
        type="text"
        lazy-rules="ondemand"
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
        lazy-rules="ondemand"
        :rules="[(val) => IS_VALID_ZIP(val) || $t('invalid_zip_code')]"
        style="width:30%"
        mask="######"
        @change="emitValue"
      >
      </q-input>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IS_VALID_STRING, IS_VALID_HOUSE_NUMBER, IS_VALID_ZIP } from 'src/data/RULES';
const emit = defineEmits(['change'])

const address = ref('')
const number = ref(null)
const zip_code = ref(null)
const city = ref(null)
const show_correspondence = ref(true)

// TODO address as class
function emitValue(){
  emit('change', {
    street: address.value,
    number: number.value,
    zip_code: zip_code.value,
    city: city.value
    // TODO: Country
  })
}
</script>
