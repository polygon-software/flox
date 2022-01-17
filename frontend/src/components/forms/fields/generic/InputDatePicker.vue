<template>
  <div >
    <p>Test:  {{props.dateLabel}}</p>
    <q-input
      v-model="date"
      mask="date"
      :rules="['date']"
      dense
      :label="props.dateLabel">
      <template #append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" @change="emitValue">
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
import {defineProps, ref} from 'vue'

const props = defineProps({
  dateLabel: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['change'])

const date = ref(new Date())

/**
 * Emits the updated value, if it is valid
 * @returns {void}
 */
function emitValue(){
  emit('change', date)
}
</script>
