<template>

  <!-- Domicile Address -->
  <strong>{{ $t('account_data.domicile_address') }}</strong>

  <AddressField @change="(val: Address) => {domicileAddress.replace(val); emitValue()}"/>

  <div class="flex justify-between items-center">
    <strong>{{ $t('account_data.correspondence_address') }}</strong>
    <q-checkbox
      v-model="hideCorrespondence"
      :label="$t('account_data.edit_correspondence_address')"
      val="xs"
    />
  </div>

  <!-- Correspondence Address -->
  <div v-if="!hideCorrespondence">
    <AddressField @change="(val) => {correspondenceInput.replace(val); emitValue()}"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ComputedRef, ref} from 'vue'
import AddressField from 'components/forms/fields/generic/AddressField.vue';
import {Address} from 'src/data/types/Address';
const emit = defineEmits(['change'])

// Addresses
const domicileAddress = ref(new Address())
const correspondenceInput = ref(new Address())

// Whether to hide the correspondence address
const hideCorrespondence = ref(true)

/**
 * Depending on whether correspondence is set to identical, get correct result
 */
const correspondenceAddress: ComputedRef<Address> = computed(() => {
  return hideCorrespondence.value? domicileAddress.value : correspondenceInput.value
})

/**
 * Emits both addresses
 * @returns {void}
 */
function emitValue(){
  emit('change', {
    domicile_address: domicileAddress.value,
    correspondence_address: correspondenceAddress.value
  })
}

</script>
