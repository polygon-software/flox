<template>

  <!-- Domicile AddressItem -->
  <strong>{{ $t('domicile_address') }}</strong>

  <AddressField @change="(val: Address) => {domicile_address.replace(val); emitValue()}"/>

  <div class="flex justify-between items-center">
    <strong>{{ $t('correspondence_address') }}</strong>
    <q-checkbox
      v-model="hide_correspondence"
      :label="$t('edit_correspondence_address')"
      val="xs"
    />
  </div>

  <!-- Correspondence AddressItem -->
  <div v-if="!hide_correspondence">
    <AddressField @change="(val) => {correspondence_input.replace(val); emitValue()}"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ComputedRef, ref} from 'vue'
import AddressField from 'components/forms/fields/generic/AddressField.vue';
import {Address} from 'src/data/types/Address';
const emit = defineEmits(['change'])

const domicile_address = ref(new Address())
const correspondence_input = ref(new Address())

const hide_correspondence = ref(true)

/**
 * Depending on whether correspondence is set to identical, get correct result
 */
const correspondence_address: ComputedRef<Address> = computed(() => {
  return hide_correspondence.value? domicile_address.value : correspondence_input.value
})

/**
 * TODO
 */
async function emitValue(){

  await new Promise(resolve => setTimeout(resolve, 10));

  console.log('emit addresses:', domicile_address.value, correspondence_address.value)

  emit('change', {
    domicile_address: domicile_address.value,
    correspondence_address: correspondence_address.value
  })
}

</script>
