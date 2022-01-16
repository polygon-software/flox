<template>
  <div >
    <q-input v-model="year" mask="date" :rules="['date']">
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="year"
              :emit-immediately="true"
              default-view=“Years”
              mask=“YYYY”
              @change="emitValue">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['change'])

const year = ref(new Date())

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValue(){
  emit('change', year)
}
</script>
