<template>

  <!-- Domicile AddressItem -->
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

  <!-- Correspondence AddressItem -->
  <div v-if="!hide_correspondence">
    <AddressField @change="emitValue"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ComputedRef, reactive, ref} from 'vue'
import AddressField from 'components/forms/fields/generic/AddressField.vue';
import {Address} from 'src/data/types/Address';
const emit = defineEmits(['change'])

const domicile_address = reactive(new Address())
const correspondence_input = reactive(new Address())

const hide_correspondence = ref(true)

/**
 * Depending on whether correspondence is set to identical, get correct result
 */
const correspondence_address: ComputedRef<Address> = computed(() => {
  return hide_correspondence.value? domicile_address : correspondence_input
})

/**
 * TODO
 */
function emitValue(){
  if(domicile_address.validate() && correspondence_address.value.validate()){
    emit('change', {
      domicile_address: domicile_address,
      correspondence_address: correspondence_address.value
    })
  } else {
    // TODO else
    console.log('INVALID in some address')
  }
}

</script>
