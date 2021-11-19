<template>

  <!-- Domicile Address -->
  <strong>{{ $t('domicile_address') }}</strong>

  <AddressField @change="emitValue"/>

  <div class="flex justify-between items-center">
    <strong>{{ $t('correspondence_address') }}</strong>
    <q-checkbox
      v-model="hide_correspondence"
      :label="$t('edit_correspondence_address')"
      val="xs"
    />
  </div>

  <!-- Correspondence Address -->
  <div v-if="!hide_correspondence">
    <AddressField @change="emitValue"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AddressField from 'components/forms/fields/generic/AddressField.vue';
const emit = defineEmits(['change'])

const address = ref('')
const number = ref(null)
const zip_code = ref(null)
const city = ref(null)

const hide_correspondence = ref(true)

/**
 * TODO
 * @param val
 */
function emitValue(val){
  emit('change', {
    street: address.value,
    number: number.value,
    zip_code: zip_code.value,
    city: city.value,
    // TODO: possibly add Country, get format from some class
  })
}

</script>
