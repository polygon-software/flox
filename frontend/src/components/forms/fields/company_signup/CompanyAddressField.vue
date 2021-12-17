<template>

  <!-- Domicile Address -->
  <strong>{{ $t('account_data.domicile_address') }}</strong>

  <AddressField @change="(val: Address) => {domicile_address.replace(val); emitValue()}"/>

  <div class="flex justify-between items-center">
    <strong>{{ $t('account_data.correspondence_address') }}</strong>
    <q-checkbox
      v-model="hide_correspondence"
      :label="$t('account_data.edit_correspondence_address')"
      val="xs"
    />
  </div>

  <!-- Correspondence Address -->
  <div v-if="!hide_correspondence">
    <AddressField @change="(val) => {correspondence_input.replace(val); emitValue()}"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ComputedRef, ref} from 'vue'
import AddressField from 'components/forms/fields/generic/AddressField.vue';
import {Address} from 'src/data/types/Address';
const emit = defineEmits(['change'])

// Addresses
const domicile_address = ref(new Address())
const correspondence_input = ref(new Address())

// Whether to hide the correspondence address
const hide_correspondence = ref(true)

/**
 * Depending on whether correspondence is set to identical, get correct result
 */
const correspondence_address: ComputedRef<Address> = computed(() => {
  return hide_correspondence.value? domicile_address.value : correspondence_input.value
})

/**
 * Emits both addresses
 * @returns {void}
 */
function emitValue(){
  emit('change', {
    domicile_address: domicile_address.value,
    correspondence_address: correspondence_address.value
  })
}

</script>
