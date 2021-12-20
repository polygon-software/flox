<template>
  <div class="row">
    <q-input
      v-model="fromDate"
      type="date"
      :label="$t('general.from')"
      outlined
      dense
      @change="emitValues"
    />
    <q-input
      v-model="toDate"
      type="date"
      :label="$t('general.to')"
      outlined
      dense
      style="margin: 0 10px 0 10px"
      @change="emitValues"
    />

    <!-- Search bar -->
    <q-input
      v-model="search"
      :label="$t('general.search')"
      type="search"
      outlined
      dense
      class="q-mb-md"
      @change="emitValues"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, ref} from 'vue';

const emit = defineEmits(['change'])

const search = ref('')
const fromDate = ref(null)
const toDate = ref(null)

/**
 * Emits the current state
 * @returns {void}
 */
function emitValues(){
  emit('change', {
    search: search.value,
    fromDate: fromDate.value,
    toDate: toDate.value
  })
}

</script>
