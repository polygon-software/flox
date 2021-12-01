<template>
  <div v-if="countdown_active">
    {{ seconds_left }}
  </div>
  <div v-else>
    {{ $t('time_expired') }}
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

const props = defineProps({
  end_date: {
    required: true,
    type: String
    }
})

const countdown_active = ref(true)
let total_time_left = ref(new Date(props.end_date).getTime() - new Date().getTime())

const days_left = ref(Math.floor(total_time_left.value / (1000 * 60 * 60 * 24)))
const hours_left = ref(Math.floor((total_time_left.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
const minutes_left = ref(Math.floor((total_time_left.value % (1000 * 60 * 60)) / (1000 * 60)))
const seconds_left = ref(Math.floor((total_time_left.value % (1000 * 60)) / 1000))

const interval = setInterval(() => {
  if (total_time_left.value <= 0) {
    clearInterval(interval)
    countdown_active.value = false
  }
  else {
    total_time_left.value--
  }
}, 1000)

</script>
